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
          className="space-y-8 pt-8 border-t border-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Tim Pengembang Platform</h2>
            <p className="text-muted-foreground text-sm">Orang-orang hebat di balik berdirinya KREASI.ID</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                name: "Eka Revandi",
                role: "Software & Cloud Architect Engineer",
                info: "Merancang fondasi arsitektur sistem yang scalable dan aman.",
                motto: '"Code is like humor. When you have to explain it, it\'s bad."',
                image: "https://i.pravatar.cc/150?u=EkaRevandi"
              },
              {
                name: "Viona Febiola",
                role: "QA Engineer",
                info: "Memastikan setiap fitur berjalan tanpa bug demi kenyamanan pengguna.",
                motto: '"Quality is not an act, it is a habit."',
                image: "https://i.pravatar.cc/150?u=VionaFebiola"
              },
              {
                name: "Aufa Wafi",
                role: "Frontend Engineer",
                info: "Mengubah desain kompleks menjadi antarmuka interaktif yang indah.",
                motto: '"Pixel perfect or nothing."',
                image: "https://i.pravatar.cc/150?u=AufaWafi"
              },
              {
                name: "Wahyu Hidayat",
                role: "Frontend Engineer",
                info: "Membangun user experience yang mulus, cepat, dan responsif.",
                motto: '"Simplicity is the soul of efficiency."',
                image: "https://i.pravatar.cc/150?u=WahyuHidayat"
              },
              {
                name: "Nurul Arif Setiawan",
                role: "Business Planning",
                info: "Merumuskan strategi bisnis dan ekspansi pasar KREASI.ID.",
                motto: '"Vision without execution is just hallucination."',
                image: "https://i.pravatar.cc/150?u=NurulArif"
              }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                className="group relative w-full h-[300px] cursor-pointer [perspective:1000px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Inner Flip Container */}
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Front Face: Photo and Role */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
                    
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    
                    {/* Text content positioned at bottom left */}
                    <div className="absolute bottom-0 left-0 p-6 w-full text-left">
                      <p className="font-bold text-white text-xl leading-tight drop-shadow-md">{member.name}</p>
                      <p className="text-sm font-medium text-accent mt-1 drop-shadow-md">{member.role}</p>
                    </div>
                  </div>

                  {/* Back Face: Info and Motto */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface-2 border border-accent rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                      <p className="text-sm text-foreground leading-relaxed font-medium">
                        {member.info}
                      </p>
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-sm italic text-muted-foreground leading-relaxed">
                          {member.motto}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
