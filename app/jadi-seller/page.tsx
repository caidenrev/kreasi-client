"use client";

import { motion } from "framer-motion";
import {
  Store,
  Wallet,
  UploadCloud,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const SELLER_URL = "http://localhost:3001";

const benefits = [
  {
    icon: Wallet,
    title: "Penghasilan Pasif",
    desc: "Kamu menerima 95% dari setiap penjualan. Platform hanya mengambil 5% sebagai biaya operasional. Saldo bisa ditarik kapan saja.",
  },
  {
    icon: UploadCloud,
    title: "Tanpa Ribet Hosting",
    desc: "Tidak perlu pusing soal server atau pengiriman file. Cukup tempel link Google Drive, sistem kami yang urus pengirimannya ke pembeli.",
  },
  {
    icon: Zap,
    title: "Pencairan Otomatis",
    desc: "Begitu pembayaran terverifikasi Midtrans, dana langsung masuk ke saldo dompetmu secara real-time tanpa konfirmasi manual.",
  },
  {
    icon: ShieldCheck,
    title: "Pembayaran Aman",
    desc: "Seluruh transaksi diproses dan diamankan oleh Midtrans, sehingga kamu dan pembeli terlindungi dari penipuan.",
  },
];

const steps = [
  {
    no: "01",
    title: "Daftar Akun Seller",
    desc: "Buat akun gratis dalam hitungan menit dan lengkapi profil serta informasi rekening bankmu.",
  },
  {
    no: "02",
    title: "Upload Produk",
    desc: "Isi detail produk, tempel link Google Drive berisi file, lalu kirim untuk direview oleh tim kurasi kami.",
  },
  {
    no: "03",
    title: "Mulai Berjualan",
    desc: "Setelah disetujui, produkmu tayang di marketplace. Pantau penjualan dan tarik saldo kapan saja.",
  },
];

export default function JadiSellerPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Ambient Glowing Orbs */}
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-accent w-[300px] h-[300px] top-0 left-[-100px]"></div>
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-purple-500 w-[400px] h-[400px] bottom-[10%] right-[-100px]"></div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 space-y-20">
        {/* Hero */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/5 text-accent text-xs font-bold">
            <Store className="w-4 h-4" /> PROGRAM KREATOR
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            Ubah Karyamu Jadi <span className="text-accent">Penghasilan</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Jual template, preset, font, motion, dan aset digital lainnya ke
            ribuan pembeli di seluruh Indonesia. Mulai gratis, tanpa biaya
            pendaftaran.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${SELLER_URL}/register`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-black font-bold px-8 py-3.5 rounded-lg text-sm transition-all duration-300 ease-in-out hover:-translate-y-1 shadow-[0_0_20px_rgba(232,255,77,0.4)] hover:shadow-[0_0_30px_rgba(232,255,77,0.7)] flex items-center justify-center gap-2"
            >
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${SELLER_URL}/login`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto border border-border hover:border-accent hover:bg-accent/5 text-foreground font-bold px-8 py-3.5 rounded-lg text-sm transition-all duration-300 ease-in-out hover:-translate-y-1 flex items-center justify-center"
            >
              Sudah punya akun? Masuk
            </a>
          </div>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((b, idx) => (
            <motion.div
              key={idx}
              className="bg-surface border border-border rounded-2xl p-8 space-y-4 hover:border-accent/50 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20">
                <b.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Cara Kerjanya</h2>
            <p className="text-muted-foreground text-sm">Mulai berjualan hanya dalam 3 langkah mudah</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <motion.div
                key={idx}
                className="bg-surface-2 border border-border rounded-2xl p-8 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <span className="text-4xl font-extrabold text-accent/30">{s.no}</span>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="bg-radial-gradient border border-border rounded-3xl p-10 md:p-16 text-center space-y-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute pointer-events-none z-0 rounded-full blur-[80px] opacity-30 dark:opacity-20 bg-accent w-[300px] h-[300px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-bold">
              <TrendingUp className="w-5 h-5" /> Gabung sekarang
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Siap menghasilkan dari karyamu?
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Ribuan kreator sudah memulai. Sekarang giliranmu mengubah aset
              digital menjadi sumber penghasilan baru.
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <a
              href={`${SELLER_URL}/register`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex bg-foreground hover:bg-accent text-background hover:text-black font-bold px-8 py-4 rounded-full text-sm transition-colors items-center justify-center gap-2"
            >
              Daftar Sebagai Kreator Sekarang <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
