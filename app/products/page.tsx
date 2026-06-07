"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";
import { Search, Filter, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"),
          where("reviewStatus", "==", "approved"),
          where("isActive", "==", true)
        );
        const snap = await getDocs(q);
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error loading product catalog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Sync category filter with URL query params change
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategoryFilter(cat);
    }
  }, [searchParams]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                            p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "newest") {
        return b.createdAt?.seconds - a.createdAt?.seconds;
      }
      if (sort === "oldest") {
        return a.createdAt?.seconds - b.createdAt?.seconds;
      }
      if (sort === "price-asc") {
        return a.price - b.price;
      }
      if (sort === "price-desc") {
        return b.price - a.price;
      }
      if (sort === "popular") {
        return (b.totalSales || 0) - (a.totalSales || 0);
      }
      return 0;
    });

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Ambient Glowing Orbs */}
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-accent w-[300px] h-[300px] top-[-50px] right-[-50px]"></div>
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-purple-500 w-[250px] h-[250px] top-[20%] left-[-100px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold tracking-tight">Katalog Produk Kreatif</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Temukan preset, template, font, dan motion graphics premium siap pakai untuk menunjang produktivitas karya Anda.
        </p>
      </motion.div>

      {/* Filter and Search Controls */}
      <motion.div 
        className="flex flex-col md:flex-row items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 z-10" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari preset, slide template, font..."
            className="pl-11 h-11 w-full bg-surface border-border text-sm text-foreground placeholder:text-muted-foreground rounded-xl focus-visible:ring-1 focus-visible:ring-accent"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 w-full md:w-[200px] bg-surface border-border text-foreground rounded-xl focus:ring-1 focus:ring-accent">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border text-foreground rounded-xl shadow-xl">
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="template">Template Desain</SelectItem>
              <SelectItem value="preset">Preset / LUTs</SelectItem>
              <SelectItem value="motion">Motion Graphic</SelectItem>
              <SelectItem value="font">Font / Typeface</SelectItem>
              <SelectItem value="asset">Aset Kreatif</SelectItem>
              <SelectItem value="other">Format Lainnya</SelectItem>
            </SelectContent>
          </Select>

          {/* Sorting dropdown */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-11 w-full md:w-[200px] bg-surface border-border text-foreground rounded-xl focus:ring-1 focus:ring-accent">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border text-foreground rounded-xl shadow-xl">
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="popular">Terlaris (Populer)</SelectItem>
              <SelectItem value="price-asc">Harga Terendah</SelectItem>
              <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-72 bg-surface border border-border rounded-xl" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground space-y-4">
          <p className="text-sm">Tidak ada produk digital yang cocok dengan pencarian Anda.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
            }}
            className="text-accent"
          >
            Reset filter
          </Button>
        </div>
      ) : (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {filteredProducts.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Link href={`/products/${p.slug}`}>
                  <Card className="group h-full bg-surface border-border overflow-hidden hover:border-accent transition-colors p-0 rounded-xl">
                    <div className="aspect-video relative overflow-hidden bg-black">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="inline-block text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold border border-accent/20 uppercase">
                        {p.category}
                      </span>
                      <h4 className="font-bold text-sm text-foreground truncate group-hover:text-accent transition-colors">
                        {p.title}
                      </h4>
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-xs text-muted-foreground">by {p.sellerName}</p>
                        <p className="text-sm font-bold text-foreground">{formatIDR(p.price)}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Memuat parameter...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
