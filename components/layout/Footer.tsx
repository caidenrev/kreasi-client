import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start gap-12 text-sm">
        <div className="space-y-2 max-w-sm">
          <Link href="/" className="inline-block text-lg font-extrabold text-foreground tracking-tight">
            KREASI<span className="text-accent">.ID</span>
          </Link>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Marketplace Produk Digital Kreatif Mitra Kreator Indonesia.
          </p>
        </div>

        <div className="flex flex-wrap gap-12 text-xs text-muted-foreground w-full md:w-auto">
          <div className="space-y-3 flex flex-col">
            <h4 className="font-bold text-foreground">Marketplace</h4>
            <Link href="/products" className="hover:text-foreground transition-colors">Semua Produk</Link>
            <a href="http://localhost:3001" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Seller Portal</a>
          </div>
          <div className="space-y-3 flex flex-col">
            <h4 className="font-bold text-foreground">Perusahaan</h4>
            <Link href="/about" className="hover:text-foreground transition-colors">Tentang Kami</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Kontak</Link>
          </div>
          <div className="space-y-3 flex flex-col">
            <h4 className="font-bold text-foreground">Bantuan</h4>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-end md:justify-end h-full">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kreasi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
