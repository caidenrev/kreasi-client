"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Award, Calendar } from "lucide-react";

export default function SellerProfilePage() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!sellerId) return;
      try {
        // Fetch seller details
        const sellerSnap = await getDoc(doc(db, "sellers", sellerId as string));
        if (sellerSnap.exists()) {
          setSeller(sellerSnap.data());
        }

        // Fetch seller products (approved & active)
        const pq = query(
          collection(db, "products"),
          where("sellerId", "==", sellerId as string),
          where("reviewStatus", "==", "approved"),
          where("isActive", "==", true)
        );
        const pSnap = await getDocs(pq);
        setProducts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching seller public profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Seller Tidak Ditemukan</h2>
        <Link href="/products" className="inline-block bg-accent text-black px-6 py-2 rounded-lg text-xs font-bold">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-12">
      {/* Back to Products */}
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>

      {/* Seller Header Card */}
      <div className="bg-surface border border-border rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-surface-2 border border-border flex items-center justify-center text-3xl font-bold text-accent">
          {seller.displayName ? seller.displayName[0].toUpperCase() : "S"}
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">{seller.displayName}</h1>
            <p className="text-sm text-muted-foreground mt-1">@{seller.username}</p>
          </div>

          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            {seller.bio || "Kreator ini belum menuliskan bio singkat."}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Bergabung {seller.joinedAt?.toDate().toLocaleDateString("id-ID") || "-"}
            </span>
            {seller.portfolioUrl && (
              <a href={seller.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" /> Portfolio
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-accent" /> {products.length} Aset Live
            </span>
          </div>
        </div>
      </div>

      {/* Seller Products Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-foreground border-b border-border pb-3">Produk dari Seller Ini</h3>
        
        {products.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Seller belum memiliki produk live.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-colors"
              >
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img src={p.thumbnail} alt={p.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-foreground truncate group-hover:text-accent">{p.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.shortDescription}</p>
                  <p className="text-sm font-bold text-accent pt-1">{formatIDR(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
