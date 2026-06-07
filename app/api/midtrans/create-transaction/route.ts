import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // wait, db is client db but next.js route runs on server, which has bypass credentials or normal client sdk
// In Next.js App Router API routes, we can use Firestore Client SDK directly if initialized, or we can use admin SDK.
// Since client SDK is already initialized and exported as `db`, we can use it to write/get documents.
import { doc, setDoc, getDoc, collection, serverTimestamp } from "firebase/firestore";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { buyer, items, totalAmount } = await request.json();

    if (!buyer || !items || items.length === 0) {
      return NextResponse.json({ message: "Data tidak lengkap." }, { status: 400 });
    }

    const orderId = `KRS-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Get platform fee percent from settings/global
    let platformFeePercent = 5;
    try {
      const settingsSnap = await getDoc(doc(db, "settings", "global"));
      if (settingsSnap.exists()) {
        platformFeePercent = settingsSnap.data().platformFeePercent ?? 5;
      }
    } catch (err) {
      console.warn("Failed to fetch settings, falling back to 5% fee:", err);
    }

    // Process order items and extract driveLink and calculate fees
    const processedItems = [];
    let totalPlatformFee = 0;

    for (const item of items) {
      const productSnap = await getDoc(doc(db, "products", item.productId));
      if (!productSnap.exists()) {
        return NextResponse.json({ message: `Produk ${item.productTitle} tidak ditemukan.` }, { status: 404 });
      }

      const pData = productSnap.data();
      const price = pData.price || 0;
      const platformFee = Math.floor((price * platformFeePercent) / 100);
      const sellerEarnings = price - platformFee;

      processedItems.push({
        productId: item.productId,
        productTitle: pData.title,
        sellerId: pData.sellerId,
        sellerName: pData.sellerName,
        price: price,
        platformFee: platformFee,
        sellerEarnings: sellerEarnings,
        driveLink: pData.driveLink || "", // Private copy
      });

      totalPlatformFee += platformFee;
    }

    // Create Midtrans Transaction Snap Token
    const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const authHeader = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;

    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
      },
      item_details: processedItems.map((item) => ({
        id: item.productId,
        price: item.price,
        quantity: 1,
        name: item.productTitle.substring(0, 50),
      })),
    };

    const midtransResponse = await axios.post(midtransUrl, midtransPayload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader,
      },
    });

    const snapToken = midtransResponse.data.token;

    // Save order document in Firestore
    await setDoc(doc(db, "orders", orderId), {
      id: orderId,
      buyer: {
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
      },
      items: processedItems,
      totalAmount: totalAmount,
      totalPlatformFee: totalPlatformFee,
      paymentStatus: "pending",
      paymentMethod: "",
      midtransTransactionId: "",
      midtransPaymentType: "",
      snapToken: snapToken,
      deliveryStatus: "pending",
      driveLinksDelivered: false,
      emailSentAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ snapToken, orderId });
  } catch (error: any) {
    console.error("Error creating Midtrans transaction:", error?.response?.data || error.message);
    return NextResponse.json(
      { message: "Gagal membuat sesi pembayaran Midtrans.", error: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}
