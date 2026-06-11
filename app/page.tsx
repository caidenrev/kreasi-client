"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { ArrowRight, Sparkles, Store, Download, Layers, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    products: 120,
    sellers: 45,
    downloads: 1800,
  });
  const [loading, setLoading] = useState(true);

  // Hero contents fallback if settings fail
  const [hero, setHero] = useState({
    headline: "Jual & Beli Produk Digital Kreatif",
    subheadline: "Dapatkan template desain, preset Lightroom, motion template, font, dan aset digital terbaik langsung dari para kreator Indonesia.",
  });

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        // Fetch hero settings
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        if (settingsSnap.exists()) {
          const sData = settingsSnap.data();
          setHero({
            headline: sData.heroHeadline || hero.headline,
            subheadline: sData.heroSubheadline || hero.subheadline,
          });
        }

        // Fetch approved & active products
        const productsQuery = query(
          collection(db, "products"),
          where("reviewStatus", "==", "approved"),
          where("isActive", "==", true),
          limit(4)
        );
        const productsSnap = await getDocs(productsQuery);
        setFeaturedProducts(productsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Fetch top sellers
        const sellersQuery = query(
          collection(db, "sellers"),
          where("status", "==", "active"),
          limit(3)
        );
        const sellersSnap = await getDocs(sellersQuery);
        setTopSellers(sellersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Live stats count (rough estimation)
        const allProductsQuery = query(
          collection(db, "products"),
          where("reviewStatus", "==", "approved"),
          where("isActive", "==", true)
        );
        const allProducts = await getDocs(allProductsQuery);
        
        const allSellers = await getDocs(collection(db, "sellers"));
        setStats({
          products: allProducts.size || 120,
          sellers: allSellers.size || 45,
          downloads: stats.downloads,
        });
      } catch (err) {
        console.error("Error fetching landing data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const categories = [
    { name: "Template", slug: "template", desc: "PPT, PSD, AI, Figma", icon: "/photoshop.svg", color: "bg-purple-500/10 text-purple-400" },
    { name: "Preset / LUTs", slug: "preset", desc: "Lightroom, Premiere, Coret", icon: "/premiere.svg", color: "bg-blue-500/10 text-blue-400" },
    { name: "Motion Graphic", slug: "motion", desc: "After Effects, Premiere, CapCut", icon: "/after-effects.svg", color: "bg-red-500/10 text-red-400" },
    { name: "Font / Typeface", slug: "font", desc: "Sans Serif, Serif, Display", icon: "/fonts.svg", color: "bg-yellow-500/10 text-yellow-400" },
    { name: "Aset Kreatif", slug: "asset", desc: "3D model, Vektor, PNG", icon: "/blender.svg", color: "bg-green-500/10 text-green-400" },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 px-6 border-b border-border bg-radial-gradient">
        {/* Ambient Glowing Orbs */}
        <div className="absolute pointer-events-none z-0 rounded-full blur-[100px] opacity-60 dark:opacity-40 bg-accent w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] -top-[100px] -left-[100px]"></div>
        <div className="absolute pointer-events-none z-0 rounded-full blur-[100px] opacity-40 dark:opacity-30 bg-purple-500 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] -bottom-[50px] -right-[10%]"></div>
        <div className="absolute pointer-events-none z-0 rounded-full blur-[100px] opacity-40 dark:opacity-30 bg-blue-500 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] top-[20%] -right-[50px]"></div>

        <motion.div 
          className="relative z-10 mx-auto max-w-4xl text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-lime-600/10 dark:bg-accent/10 border border-lime-600/20 dark:border-accent/20 text-lime-800 dark:text-accent px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Store className="w-3.5 h-3.5" /> Ruang Berkarya Kreator Lokal
          </motion.div>
          <motion.h1 
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {hero.headline}
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {hero.subheadline}
          </motion.p>
          <motion.div 
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              href="/products"
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-black font-bold px-8 py-3.5 rounded-lg text-sm transition-all duration-300 ease-in-out hover:-translate-y-1 shadow-[0_0_20px_rgba(232,255,77,0.4)] hover:shadow-[0_0_30px_rgba(232,255,77,0.7)] flex items-center justify-center gap-2"
            >
              Mulai Belanja <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/jadi-seller"
              className="w-full sm:w-auto border border-border hover:border-accent hover:bg-accent/5 text-foreground font-bold px-8 py-3.5 rounded-lg text-sm transition-all duration-300 ease-in-out hover:-translate-y-1 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center"
            >
              Mulai Jualan (Seller)
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-6 space-y-8">
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold text-foreground">Kategori Terpopuler</h2>
          <p className="text-muted-foreground text-sm">Pilih kategori aset digital yang sesuai dengan project Anda.</p>
        </motion.div>

        {/* Continuous Marquee Container */}
        <div className="relative overflow-hidden w-full py-8 mt-6 border-y border-border/50 bg-surface/30">
          {/* Gradient Masks for fade effect at edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10"></div>

          <motion.div
            className="flex gap-20 w-max"
            animate={{ x: [0, "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40,
            }}
          >
            {/* Menduplikasi array untuk efek infinite loop yang mulus */}
            {[...categories, ...categories, ...categories, ...categories].map((cat, idx) => (
              <Link
                key={`${cat.slug}-${idx}`}
                href={`/products?category=${cat.slug}`}
                className="flex items-center gap-4 text-muted-foreground hover:text-foreground hover:scale-105 transition-all"
              >
                {/* Logo Software Kategori */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-extrabold text-2xl uppercase tracking-tight">{cat.name}</span>
                  <span className="text-[10px] font-bold opacity-60 tracking-widest">{cat.desc}</span>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 space-y-8">
        <motion.div 
          className="flex justify-between items-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl font-extrabold text-foreground">Produk Unggulan</h2>
            <p className="text-muted-foreground text-sm mt-1">Produk digital pilihan kurator yang siap meningkatkan estetika karya Anda.</p>
          </div>
          <Link href="/products" className="text-sm text-accent hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-surface border border-border rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-12">Belum ada produk unggulan tersedia.</p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {featuredProducts.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="block h-full group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-colors"
                >
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
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Statistics Section */}
      <section className="bg-surface border-y border-border py-16 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <p className="text-4xl font-extrabold text-accent">{stats.products}+</p>
            <p className="text-sm text-foreground font-semibold">Produk Digital Siap Download</p>
            <p className="text-xs text-muted-foreground">Template, LUTs, Font, Asset 3D, dan lainnya</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-extrabold text-accent">{stats.sellers}+</p>
            <p className="text-sm text-foreground font-semibold">Kreator Profesional Indonesia</p>
            <p className="text-xs text-muted-foreground">Mitra seller terverifikasi kurasi</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-extrabold text-accent">{stats.downloads}+</p>
            <p className="text-sm text-foreground font-semibold">Transaksi Terkirim Real-Time</p>
            <p className="text-xs text-muted-foreground">Link Google Drive langsung muncul sukses</p>
          </div>
        </div>
      </section>

      {/* Safety Guarantee */}
      <section className="mx-auto max-w-4xl px-6 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground">Sistem Pengiriman Aman & Cepat</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Setiap transaksi dilindungi oleh sistem keamanan pembayaran resmi Midtrans. Setelah verifikasi selesai, file digital langsung dikirimkan ke halaman konfirmasi sukses pembayaran & backup email Anda.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 space-y-12">
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold text-foreground">Cara Belanja di KREASI.ID</h2>
          <p className="text-muted-foreground text-sm">Proses instan tanpa ribet, aset digital langsung di tangan Anda.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border z-0"></div>
          
          <motion.div 
            className="relative z-10 text-center space-y-4 bg-background p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto bg-surface border border-border rounded-2xl flex items-center justify-center text-xl font-bold text-foreground">
              1
            </div>
            <h3 className="font-bold text-lg text-foreground">Pilih Produk</h3>
            <p className="text-sm text-muted-foreground">Jelajahi ratusan aset digital premium yang dikurasi khusus untuk kreator Indonesia.</p>
          </motion.div>
          
          <motion.div 
            className="relative z-10 text-center space-y-4 bg-background p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto bg-surface border border-border rounded-2xl flex items-center justify-center text-xl font-bold text-foreground">
              2
            </div>
            <h3 className="font-bold text-lg text-foreground">Bayar Otomatis</h3>
            <p className="text-sm text-muted-foreground">Selesaikan pembayaran via QRIS, GoPay, atau Virtual Account dengan aman melalui Midtrans.</p>
          </motion.div>
          
          <motion.div 
            className="relative z-10 text-center space-y-4 bg-background p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto bg-accent text-black rounded-2xl flex items-center justify-center text-xl font-bold">
              3
            </div>
            <h3 className="font-bold text-lg text-foreground">Langsung Download</h3>
            <p className="text-sm text-muted-foreground">Tanpa menunggu admin! Link Google Drive rahasia akan langsung terbuka seketika.</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface border-y border-border py-20 px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <motion.div 
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold text-foreground">Apa Kata Kreator?</h2>
            <p className="text-muted-foreground text-sm">Cerita sukses mereka yang telah menggunakan produk dari KREASI.ID.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Budi Santoso", role: "Video Editor", quote: "Motion graphic template-nya sangat menghemat waktu editing. Klien saya suka banget sama hasilnya!", rating: 5 },
              { name: "Siti Aminah", role: "UI/UX Designer", quote: "UI Kit yang dibeli dari sini sangat rapi strukturnya. Auto-layout Figma-nya juara. Sangat worth it!", rating: 5 },
              { name: "Ahmad Reza", role: "Content Creator", quote: "LUTs pack untuk Premiere Pro bikin color grading video cinematic saya cuma butuh 1 kali klik. Terbaik!", rating: 5 },
            ].map((testi, i) => (
              <motion.div 
                key={i} 
                className="bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm hover:border-accent/50 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex text-accent">
                  {[...Array(testi.rating)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">&quot;{testi.quote}&quot;</p>
                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center font-bold text-foreground">
                    {testi.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{testi.name}</p>
                    <p className="text-xs text-muted-foreground">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="mx-auto max-w-5xl px-6 pt-12">
        <div className="bg-radial-gradient border border-border rounded-3xl p-10 md:p-16 text-center space-y-8 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute pointer-events-none z-0 rounded-full blur-[80px] opacity-30 dark:opacity-20 bg-accent w-[300px] h-[300px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">Punya Karya Digital nganggur?</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Ubah aset desain, preset, template, atau font buatanmu menjadi *passive income*. Bergabunglah dengan KREASI.ID dan raih pembeli dari seluruh Indonesia.
            </p>
          </div>
          
          <div className="relative z-10 pt-4">
            <Link
              href="/jadi-seller"
              className="inline-flex bg-foreground hover:bg-accent text-background hover:text-black font-bold px-8 py-4 rounded-full text-sm transition-colors items-center justify-center"
            >
              Daftar Sebagai Kreator Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
