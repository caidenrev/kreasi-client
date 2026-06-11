"use client";

import { motion } from "framer-motion";

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
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Tentang <span className="text-accent">KREASI.ID</span>
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
            <h2 className="text-4xl font-extrabold text-foreground">Mengapa <span className="text-accent">KREASI.ID?</span></h2>
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
