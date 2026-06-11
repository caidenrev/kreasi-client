"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Search, Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TrackPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setHasSearched(true);
    setOrders([]);

    try {
      // In Firestore, we can query by buyer.email
      const q = query(
        collection(db, "orders"),
        where("buyer.email", "==", email)
      );

      const querySnapshot = await getDocs(q);
      const fetchedOrders: any[] = [];
      
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });

      // Sort by createdAt descending locally to avoid requiring compound index
      fetchedOrders.sort((a, b) => {
        const dateA = a.createdAt?.toMillis() || 0;
        const dateB = b.createdAt?.toMillis() || 0;
        return dateB - dateA;
      });

      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Berhasil</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"><Clock className="w-3 h-3 mr-1" /> Menunggu</Badge>;
      case "canceled":
      case "cancel":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8 min-h-[70vh]">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          Lacak <span className="text-accent">Pesanan</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Masukkan alamat email yang Anda gunakan saat checkout untuk melihat riwayat transaksi dan mengakses link download produk digital Anda.
        </p>
      </div>

      <Card className="bg-surface border-border max-w-xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="email"
              placeholder="Masukkan alamat email Anda..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-2 border-border text-foreground focus-visible:ring-accent flex-1"
              required
            />
            <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-black font-bold">
              {loading ? "Mencari..." : <Search className="w-4 h-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-4">
            <Package className="w-5 h-5 text-accent" />
            Riwayat Transaksi
          </h2>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-surface-2 rounded-xl border border-border border-dashed">
              <p className="text-muted-foreground">Tidak ada pesanan yang ditemukan untuk email ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="bg-surface border-border hover:border-accent/30 transition-colors">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-foreground">{order.id}</span>
                        {getStatusBadge(order.paymentStatus)}
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>{new Date(order.createdAt?.toMillis() || Date.now()).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}</p>
                        <p className="truncate">
                          {order.items?.length || 0} item(s) • <span className="font-semibold text-foreground">{formatIDR(order.totalAmount)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex-shrink-0">
                      <Button asChild className="w-full md:w-auto bg-surface-3 hover:bg-[#3A3A3A] text-foreground border border-border text-xs font-bold">
                        <Link href={`/success?order_id=${order.id}`}>
                          Lihat Detail
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
