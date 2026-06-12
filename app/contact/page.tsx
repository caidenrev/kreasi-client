"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Ambient Glowing Orbs */}
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-accent w-[300px] h-[300px] top-[-50px] right-[-50px]"></div>
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-blue-500 w-[400px] h-[400px] bottom-[10%] left-[-100px]"></div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Hubungi Kami</h1>
          <p className="text-muted-foreground">Ada pertanyaan atau butuh bantuan? Tim kami siap membantu Anda.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-foreground">Informasi Kontak</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-accent shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Email Bantuan</p>
                  <p className="text-muted-foreground text-sm mt-1">support@kreasi.id</p>
                  <p className="text-muted-foreground text-sm">Respon dalam 1x24 jam kerja.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-accent shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Telepon / WhatsApp</p>
                  <p className="text-muted-foreground text-sm mt-1">+62 888 6340 076</p>
                  <p className="text-muted-foreground text-sm">Senin - Jumat, 09:00 - 17:00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-accent shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Kantor Pusat</p>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    MSIG Tower Lt. 23, SCBD<br />
                    Jl. Jenderal Sudirman Kav. 7-8, Setiabudi<br />
                    Jakarta Selatan, 12190
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-surface border border-border rounded-2xl p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-6">Kirim Pesan</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Alamat Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Pesan</label>
                <textarea
                  rows={4}
                  placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent resize-none"
                ></textarea>
              </div>
              <button
                type="button"
                className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-3 rounded-lg transition-colors mt-2"
              >
                Kirim Pesan
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
