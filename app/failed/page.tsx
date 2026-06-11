"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const transactionStatus = searchParams.get("transaction_status");

  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // Ketika user dialihkan ke halaman ini, kita langsung sync status ke backend
    // untuk memastikan database kita juga ter-update menjadi canceled/expire
    const syncStatus = async () => {
      if (!orderId) {
        setIsSyncing(false);
        return;
      }
      try {
        await fetch("/api/midtrans/sync-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
      } catch (err) {
        console.error("Error syncing status:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncStatus();
  }, [orderId]);

  if (isSyncing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-sm text-muted-foreground">Memproses status pembatalan Anda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-16 px-6">
      <Card className="bg-surface border-border text-center shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
            <XCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground">Transaksi Gagal</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {transactionStatus === "expire" 
                ? "Waktu pembayaran telah kedaluwarsa. Transaksi Anda otomatis dibatalkan."
                : "Pembayaran Anda gagal atau dibatalkan. Silakan coba checkout kembali."}
            </p>
          </div>

          <div className="border-t border-border pt-6 flex justify-between items-center text-xs text-muted-foreground">
            <span>Order ID: <span className="font-mono text-foreground font-semibold">{orderId || "-"}</span></span>
            <span className="uppercase">{transactionStatus || "FAILED"}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild variant="outline" className="flex-1 bg-surface-2 hover:bg-surface-3 border-border font-bold">
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
              </Link>
            </Button>
            {orderId && (
              <Button asChild className="flex-1 bg-accent text-black hover:bg-accent-hover font-bold">
                <Link href={`/success?order_id=${orderId}`}>
                  Coba Bayar Lagi
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FailedPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Memuat halaman...</div>}>
      <FailedContent />
    </Suspense>
  );
}
