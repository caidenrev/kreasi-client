"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Store, Trash2, X, Menu, LayoutGrid, Info, HelpCircle, Mail, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const { cart, removeFromCart, cartTotal } = useCart();
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  // Tutup menu mobile otomatis saat berpindah halaman
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  const getLinkClass = (path: string, exact: boolean = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return `relative text-sm transition-colors duration-300 ease-in-out ${
      isActive
        ? "font-bold text-foreground"
        : "font-medium text-muted-foreground hover:text-foreground"
    }`;
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-xl border-b border-border/50 shadow-lg">
      <div className="mx-auto max-w-7xl h-16 flex items-center justify-between px-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-foreground">
          KREASI<span className="text-accent">.ID</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className={`${getLinkClass("/products")} hidden sm:block`}>
            Katalog
          </Link>
          <Link href="/track" className={`${getLinkClass("/track")} hidden sm:block`}>
            Lacak Pesanan
          </Link>
          <Link href="/about" className={`${getLinkClass("/about")} hidden sm:block`}>
            Tentang
          </Link>
          <Link href="/faq" className={`${getLinkClass("/faq")} hidden sm:block`}>
            FAQ
          </Link>
          <Link href="/contact" className={`${getLinkClass("/contact")} hidden sm:block`}>
            Kontak
          </Link>
          <Link
            href="/jadi-seller"
            className={`${getLinkClass("/jadi-seller")} hidden sm:flex items-center gap-1`}
          >
            <Store className="w-4 h-4 text-accent" />
            Jadi Seller
          </Link>

          {/* Cart Section */}
          <div className="relative flex items-center gap-2">
            <ThemeToggle />
            
            <button
              onClick={() => setShowCartDropdown(!showCartDropdown)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-black font-bold text-[10px] rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {showCartDropdown && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-surface border border-border rounded-xl p-4 shadow-xl space-y-4 cursor-default">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">Keranjang</h4>
                    <span className="text-xs text-muted-foreground">{cart.length} Item</span>
                  </div>
                  <button onClick={() => setShowCartDropdown(false)} className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-surface-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">Keranjang Anda kosong.</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center justify-between text-xs">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-10 h-10 rounded object-cover border border-border bg-black"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">{item.title}</p>
                            <p className="text-muted-foreground">{formatIDR(item.price)}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-3 flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold text-accent">{formatIDR(cartTotal)}</span>
                    </div>

                    <Link
                      href="/checkout"
                      onClick={() => setShowCartDropdown(false)}
                      className="block w-full text-center bg-accent hover:bg-accent-hover text-black text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      Lanjut ke Pembayaran
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Buka menu navigasi"
            aria-expanded={showMobileMenu}
            className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="relative block w-5 h-5">
              <Menu
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  showMobileMenu ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  showMobileMenu ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                }`}
              />
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile Full-Width Menu Panel (overlay, tidak mendorong konten) */}
      <div
        className={`sm:hidden absolute top-full left-0 w-full overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl shadow-lg transition-all duration-500 ease-in-out ${
          showMobileMenu
            ? "max-h-96 opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 py-3 flex flex-col">
          <Link
            href="/products"
            className="flex items-center gap-3 px-2 py-3 rounded-lg text-sm font-medium text-muted-foreground border border-transparent hover:border-accent/50 hover:text-foreground hover:bg-surface-2 transition-all duration-200"
          >
            <LayoutGrid className="w-4 h-4 text-accent" />
            Katalog
          </Link>
          <Link
            href="/track"
            className="flex items-center gap-3 px-2 py-3 rounded-lg text-sm font-medium text-muted-foreground border border-transparent hover:border-accent/50 hover:text-foreground hover:bg-surface-2 transition-all duration-200"
          >
            <Package className="w-4 h-4 text-accent" />
            Lacak Pesanan
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-3 px-2 py-3 rounded-lg text-sm font-medium text-muted-foreground border border-transparent hover:border-accent/50 hover:text-foreground hover:bg-surface-2 transition-all duration-200"
          >
            <Info className="w-4 h-4 text-accent" />
            Tentang
          </Link>
          <Link
            href="/faq"
            className="flex items-center gap-3 px-2 py-3 rounded-lg text-sm font-medium text-muted-foreground border border-transparent hover:border-accent/50 hover:text-foreground hover:bg-surface-2 transition-all duration-200"
          >
            <HelpCircle className="w-4 h-4 text-accent" />
            FAQ
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-3 px-2 py-3 rounded-lg text-sm font-medium text-muted-foreground border border-transparent hover:border-accent/50 hover:text-foreground hover:bg-surface-2 transition-all duration-200"
          >
            <Mail className="w-4 h-4 text-accent" />
            Kontak
          </Link>

          <div className="my-2 border-t border-border" />

          <a
            href="http://localhost:3001/register"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-2 py-3 rounded-lg text-sm font-bold text-foreground border border-transparent hover:border-accent/50 hover:bg-surface-2 transition-all duration-200"
          >
            <Store className="w-4 h-4 text-accent" />
            Jadi Seller
          </a>
        </nav>
      </div>
    </header>
  );
}
