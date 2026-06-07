"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const faqs = [
    {
      category: "Pembelian & Pembayaran",
      items: [
        { q: "Metode pembayaran apa saja yang didukung?", a: "Kami mendukung pembayaran melalui QRIS, GoPay, OVO, ShopeePay, serta Virtual Account dari berbagai bank (BCA, Mandiri, BNI, BRI) melalui sistem keamanan Midtrans." },
        { q: "Kapan saya mendapatkan link download?", a: "Segera! Setelah pembayaran Anda berhasil diverifikasi oleh sistem (biasanya dalam hitungan detik), Anda akan langsung diarahkan ke halaman berisi link Google Drive untuk mengunduh produk. Link tersebut juga dikirimkan ke email Anda." },
        { q: "Apakah ada garansi uang kembali?", a: "Karena sifat produk digital yang dapat langsung disalin setelah diunduh, kami umumnya tidak menerima pengembalian dana. Namun, jika file rusak atau tidak sesuai deskripsi, silakan hubungi seller terkait atau tim support kami." }
      ]
    },
    {
      category: "Kreator (Seller)",
      items: [
        { q: "Siapa saja yang bisa menjadi kreator di KREASI.ID?", a: "Siapa saja! Selama Anda memiliki karya digital original (buatan sendiri) yang berkualitas dan bermanfaat bagi orang lain." },
        { q: "Berapa potongan komisi dari setiap penjualan?", a: "KREASI.ID mengambil komisi flat sebesar 10% dari setiap transaksi. Sisanya (90%) sepenuhnya menjadi hak kreator." },
        { q: "Kapan saya bisa menarik saldo penjualan?", a: "Anda dapat menarik saldo penjualan kapan saja. Pencairan akan diproses dan masuk ke rekening bank Anda dalam waktu maksimal 1x24 jam kerja." }
      ]
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Ambient Glowing Orbs */}
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-accent w-[300px] h-[300px] top-[10%] left-[-100px]"></div>
      <div className="absolute pointer-events-none z-0 rounded-full blur-[120px] opacity-40 dark:opacity-20 bg-purple-500 w-[250px] h-[250px] bottom-[20%] right-[-50px]"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 space-y-12">
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-6">
          <MessageCircleQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">FAQ</h1>
        <p className="text-muted-foreground text-lg">Pertanyaan yang Sering Diajukan</p>
      </motion.div>

      <div className="space-y-12">
        {faqs.map((group, idx) => (
          <motion.div 
            key={idx} 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
          >
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">{group.category}</h2>
            <div className="space-y-4">
              {group.items.map((item, i) => (
                <FAQItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-2 transition-colors"
      >
        <span className="font-bold text-foreground pr-4">{question}</span>
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
            <div className="px-6 pb-4 pt-1">
              <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
