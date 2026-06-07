"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Download, ExternalLink, RefreshCw, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  useEffect(() => {
    if (!orderId) {
      setError("Order ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    // Set up real-time listener to the order document
    const unsub = onSnapshot(
      doc(db, "orders", orderId),
      (docSnap) => {
        if (docSnap.exists()) {
          setOrder(docSnap.data());
          setError("");
        } else {
          setError("Transaksi tidak ditemukan.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to order status:", err);
        // If it's a permission-denied error, it means paymentStatus is still pending
        // since our rules only allow reading paid orders.
        // We will show a checking state.
        setLoading(false);
      }
    );

    return () => unsub();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm text-muted-foreground">Memverifikasi status pembayaran Anda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto my-16 bg-surface border-border text-center p-8 border">
        <CardContent className="space-y-4 p-0">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Verifikasi Gagal</h2>
          <p className="text-xs text-muted-foreground">{error}</p>
          <Button asChild className="bg-accent text-black hover:bg-accent-hover font-bold text-xs mt-4">
            <Link href="/products">Kembali ke Katalog</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Handle pending state
  const isPaid = order?.paymentStatus === "paid";

  return (
    <div className="max-w-2xl mx-auto my-12 px-6 space-y-8">
      {isPaid ? (
        /* Paid / Success State */
        <Card className="bg-surface border-border text-center">
          <CardContent className="p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mx-auto border border-green-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-foreground">Pembayaran Berhasil! 🎉</h1>
              <p className="text-xs text-muted-foreground">
                Terima kasih telah berbelanja di Kreasi. Produk Anda kini siap untuk diakses.
              </p>
            </div>

          {/* Purchased Items / Downloads */}
          <div className="border-t border-border pt-6 space-y-4 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">FILE DOWNLOAD PRODUK</h3>
            
            <div className="space-y-3">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="bg-surface-2 border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.productTitle}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Seller: {item.sellerName}</p>
                  </div>

                  {item.driveLink ? (
                    <a
                      href={item.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-accent hover:bg-accent-hover text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Akses Google Drive
                    </a>
                  ) : (
                    <span className="text-xs text-yellow-500 font-semibold">Mempersiapkan link...</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Backup alert */}
          <p className="text-[11px] text-muted-foreground">
            *Link unduhan juga dikirimkan ke email <span className="text-foreground font-semibold">{order.buyer?.email}</span> sebagai cadangan.
          </p>

          <div className="border-t border-border pt-6 flex justify-between items-center text-xs text-muted-foreground">
            <span>Order ID: <span className="font-mono text-foreground">{orderId}</span></span>
            <span>Total Bayar: <span className="font-bold text-foreground">{formatIDR(order.totalAmount)}</span></span>
          </div>

          <Button asChild className="w-full bg-surface-3 hover:bg-[#3A3A3A] text-foreground font-bold py-5 mt-4">
            <Link href="/products">Jelajahi Produk Lainnya</Link>
          </Button>
        </CardContent>
      </Card>
      ) : (
        /* Pending Payment State */
        <Card className="bg-surface border-border text-center">
          <CardContent className="p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center mx-auto border border-yellow-500/20 animate-pulse">
              <Clock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-foreground">Menunggu Verifikasi Pembayaran</h1>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Silakan selesaikan pembayaran Anda di jendela Midtrans Snap. Halaman ini akan otomatis diperbarui begitu pembayaran terkonfirmasi.
              </p>
            </div>

          <div className="border-t border-b border-border py-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-foreground">{orderId}</span>
            </div>
            {order && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Tagihan</span>
                <span className="font-bold text-accent">{formatIDR(order.totalAmount)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-accent hover:bg-accent-hover text-black font-bold py-5"
            >
              Cek Status Manual
            </Button>
            <Button asChild className="flex-1 bg-surface-3 hover:bg-[#3A3A3A] text-foreground font-bold py-5">
              <Link href="/products">Kembali ke Katalog</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Memuat parameter...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
