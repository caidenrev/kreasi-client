import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, serverTimestamp, collection, setDoc } from "firebase/firestore";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ message: "Order ID diperlukan" }, { status: 400 });
    }

    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return NextResponse.json({ message: "Order tidak ditemukan" }, { status: 404 });
    }

    const orderData = orderSnap.data();

    // Jika sudah paid, tidak perlu sync lagi
    if (orderData.paymentStatus === "paid") {
      return NextResponse.json({ status: "paid" });
    }

    const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
      ? `https://api.midtrans.com/v2/${orderId}/status`
      : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const authHeader = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;

    const response = await axios.get(midtransUrl, {
      headers: {
        Accept: "application/json",
        Authorization: authHeader,
      },
    });

    const data = response.data;
    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;

    let isPaid = false;
    let isFailed = false;

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        // pending
      } else if (fraudStatus === "accept") {
        isPaid = true;
      }
    } else if (transactionStatus === "settlement") {
      isPaid = true;
    } else if (["cancel", "deny", "expire", "failure"].includes(transactionStatus)) {
      isFailed = true;
    }

    if (isPaid) {
      // Update status order menjadi paid
      await updateDoc(orderRef, {
        paymentStatus: "paid",
        midtransTransactionId: data.transaction_id || "",
        midtransPaymentType: data.payment_type || "",
        updatedAt: serverTimestamp(),
      });

      // Update saldo tiap seller
      const items = orderData.items || [];
      for (const item of items) {
        if (item.sellerId && item.sellerEarnings > 0) {
          const sellerRef = doc(db, "sellers", item.sellerId);
          const sellerSnap = await getDoc(sellerRef);
          
          if (sellerSnap.exists()) {
            const currentBalance = sellerSnap.data().walletBalance || 0;
            const newBalance = currentBalance + item.sellerEarnings;

            // Update data seller (walletBalance, totalEarnings, totalSales)
            await updateDoc(sellerRef, {
              walletBalance: increment(item.sellerEarnings),
              totalEarnings: increment(item.sellerEarnings),
              totalSales: increment(1),
              updatedAt: serverTimestamp(),
            });

            // Rekam riwayat transaksi wallet
            const txRef = doc(collection(db, "wallet_transactions"));
            await setDoc(txRef, {
              sellerId: item.sellerId,
              orderId: orderId,
              type: "credit",
              amount: item.sellerEarnings,
              description: `Penjualan produk: ${item.productTitle}`,
              balanceAfter: newBalance,
              createdAt: serverTimestamp(),
            });
          }
        }
      }
      return NextResponse.json({ status: "paid" });
    } else if (isFailed) {
      await updateDoc(orderRef, {
        paymentStatus: "canceled",
        midtransTransactionId: data.transaction_id || "",
        updatedAt: serverTimestamp(),
      });
      return NextResponse.json({ status: "canceled" });
    }

    return NextResponse.json({ status: transactionStatus });
  } catch (error: any) {
    // Return pending state if not found in midtrans (e.g., token not paid yet)
    if (error?.response?.status === 404) {
       return NextResponse.json({ status: "pending" });
    }
    console.error("Error syncing status:", error?.response?.data || error.message);
    return NextResponse.json(
      { message: "Gagal memverifikasi status." },
      { status: 500 }
    );
  }
}
