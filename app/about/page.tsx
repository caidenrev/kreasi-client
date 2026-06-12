"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Instagram, Linkedin, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Ambient Glowing Orbs */}
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-accent w-[300px] h-[300px] top-0 left-[-100px]"></div>
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-purple-500 w-[400px] h-[400px] bottom-[10%] right-[-100px]"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 space-y-16">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight flex flex-col items-center justify-center gap-5">
            <span>Tentang</span>
            <span className="inline-flex items-center">
              <img src="/logo-light-mode.png" alt="KREASI.ID" className="h-20 md:h-24 theme-img-light" />
              <img src="/logo-dark-mode.png" alt="KREASI.ID" className="h-20 md:h-24 theme-img-dark" />
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Platform marketplace aset digital pertama di Indonesia yang menghubungkan kreator lokal dengan pembeli dari seluruh nusantara secara real-time.
          </p>
        </motion.div>

        <motion.div
          className="bg-surface border border-border rounded-2xl p-8 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-foreground">Visi Kami</h2>
          <p className="text-muted-foreground leading-relaxed">
            Kami percaya bahwa karya digital kreator Indonesia memiliki kualitas kelas dunia. Visi kami adalah menciptakan ekosistem yang sehat, di mana setiap *designer*, *video editor*, dan kreator konten bisa mendapatkan penghasilan pasif dari karya yang mereka ciptakan.
          </p>
        </motion.div>

        {/* Founder Overview Section */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center py-12">
          <motion.div
            className="w-full md:w-1/2 flex justify-center relative"
            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            {/* Gradient Overlay biar bagian bawah foto menyatu mulus (smooth) dengan background */}
            <div className="absolute inset-x-0 bottom-[-10px] h-48 bg-gradient-to-t from-background via-background/90 to-transparent z-10 pointer-events-none"></div>

            <img
              src="/founder.png"
              alt="Founder Kreasi.id"
              className="w-full max-w-[420px] md:max-w-[550px] h-auto drop-shadow-2xl relative z-0"
              onError={(e) => {
                // Fallback jika gambar belum diupload oleh user
                e.currentTarget.src = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
              }}
            />
          </motion.div>

          <motion.div
            className="space-y-6 text-center md:text-left flex-1"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Mengenal Sang <span className="text-accent">Founder</span>
            </h2>

            {/* Title Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-surface-2 border border-border rounded-full text-xs font-semibold text-foreground">Software Engineer</span>
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">Google Certified Cloud Engineer</span>
              <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">Amazon Web Services Cloud Ops</span>
            </div>

            <div className="space-y-3 mt-8">
              <StoryDropdown />
              <SystemDropdown />
              <SocialDropdown />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-surface-2 border border-border rounded-2xl p-8 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-foreground">Bagi Kreator (Seller)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tidak perlu pusing memikirkan *hosting*, sistem pembayaran otomatis, atau pengiriman file. Anda cukup fokus berkarya, *upload* file Anda ke Google Drive, tempel link-nya di sini, dan sistem kami akan mengurus sisanya hingga dana masuk ke saldo Anda.
            </p>
          </motion.div>
          <motion.div
            className="bg-surface-2 border border-border rounded-2xl p-8 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-foreground">Bagi Pembeli (Buyer)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dapatkan aset digital original langsung dari kreatornya tanpa perantara. Pembayaran aman terverifikasi oleh Midtrans, dan file langsung dapat diunduh detik itu juga tanpa perlu konfirmasi manual dari admin.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="pt-16 border-t border-border flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-extrabold text-foreground flex flex-col items-center justify-center gap-5">
              <span>Mengapa</span>
              <span className="inline-flex items-center">
                <img src="/logo-light-mode.png" alt="KREASI.ID" className="h-16 md:h-20 theme-img-light" />
                <img src="/logo-dark-mode.png" alt="KREASI.ID" className="h-16 md:h-20 theme-img-dark" />
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Keunggulan platform kami untuk menunjang kebutuhan digital Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            <div className="bg-surface border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Aman & Terpercaya</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Setiap transaksi dilindungi sistem keamanan berstandar tinggi dan terverifikasi secara otomatis.
              </p>
            </div>
            <div className="bg-surface border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Akses Instan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                File digital Anda langsung dapat diunduh detik itu juga setelah pembayaran berhasil dikonfirmasi.
              </p>
            </div>
            <div className="bg-surface border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Dukungan Kreator Lokal</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dengan bertransaksi di Kreasi.id, Anda ikut memajukan industri kreatif dan mendukung karya anak bangsa.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SocialDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-2 transition-colors"
      >
        <span className="font-bold text-foreground pr-4">Temenan bareng Founder yuk!</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 flex flex-col space-y-4">
              <a href="https://instagram.com/caidenrev" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </div>
                <span className="font-medium">Instagram (@caidenrev)</span>
              </a>
              <a href="https://linkedin.com/in/caidenrev" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span className="font-medium">LinkedIn (caidenrev)</span>
              </a>
              <a href="https://eka-revandi.vercel.app" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="font-medium">Portfolio Website</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SystemDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-2 transition-colors"
      >
        <span className="font-bold text-foreground pr-4">Infrastruktur & Keamanan</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <p className="text-muted-foreground leading-relaxed text-sm">
                Seluruh sistem di balik Kreasi.id ini di-<i>develop</i> secara mandiri langsung dari nol. Jadi buat urusan mastiin <i>website</i> tetep kenceng, aman, dan nggak gampang <i>down</i> pas lagi rame-ramenya orang transaksi, semuanya udah dirancang dan dipikirin matang-matang!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-2 transition-colors"
      >
        <span className="font-bold text-foreground pr-4">Cerita di Balik Kreasi.id</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground leading-relaxed text-sm">
                "Awalnya aku bikin Kreasi.id karena ngelihat banyak banget kreator lokal yang karyanya keren-keren, tapi suka bingung cari platform jualan yang simpel. Tujuannya sederhana aja: ngasih tempat yang aman dan gampang, biar temen-temen kreator bisa fokus berkarya, nggak perlu lagi pusing mikirin urusan teknis web atau ribetnya server."
              </blockquote>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
