"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ShieldCheck, Download, ExternalLink, Layers, ArrowLeft, ShoppingBag, Share2, Link as LinkIcon, Facebook, Twitter, MessageCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const handleCopyLink = async () => {
    try {
      // First try the modern async clipboard API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(pageUrl);
        toast.success("Link produk berhasil disalin!");
      }
    } catch (err) {
      // Fallback for IDE preview / blocked iframes / HTTP
      try {
        const textArea = document.createElement("textarea");
        textArea.value = pageUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast.success("Link produk berhasil disalin!");
        } else {
          toast.error("Gagal menyalin link. Silakan copy dari browser address bar.");
        }
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
        toast.error("Gagal menyalin link. Silakan copy dari browser address bar.");
      }
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || 'Produk KREASI.ID',
          text: `Lihat produk keren ini: ${product?.title}`,
          url: pageUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slug) return;
      try {
        const q = query(
          collection(db, "products"),
          where("slug", "==", slug as string),
          where("reviewStatus", "==", "approved"),
          where("isActive", "==", true)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const pData = { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
          setProduct(pData);

          // Fetch similar products in same category
          const simQuery = query(
            collection(db, "products"),
            where("category", "==", pData.category),
            where("reviewStatus", "==", "approved"),
            where("isActive", "==", true),
            limit(4)
          );
          const simSnap = await getDocs(simQuery);
          setSimilarProducts(
            simSnap.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter((item) => item.id !== pData.id)
          );
        } else {
          alert("Produk tidak ditemukan.");
          router.push("/products");
        }
      } catch (err) {
        console.error("Error loading product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-12">
      {/* Back button */}
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Image carousel / thumbnails preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video relative rounded-xl overflow-hidden border border-border bg-black">
            <img src={product.thumbnail} alt={product.title} className="object-cover w-full h-full" />
          </div>

          {product.previewImages && product.previewImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.previewImages.map((imgUrl: string, idx: number) => (
                <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-border bg-black">
                  <img src={imgUrl} alt="Preview" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}

          {/* Description Tabs */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 text-sm font-semibold border-b-2 px-2 transition-colors ${
                  activeTab === "description" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Deskripsi Produk
              </button>

              <button
                onClick={handleNativeShare}
                className="flex items-center gap-2 pb-3 px-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                title="Bagikan produk ini"
              >
                <Share2 className="w-4 h-4 group-hover:text-accent transition-colors" /> Bagikan
              </button>
            </div>

            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line bg-surface p-6 rounded-xl border border-border">
              {product.description || "Tidak ada deskripsi detail untuk produk ini."}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Specs Card */}
        <div className="space-y-6">
          {/* Card: Purchase Options */}
          <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold border border-accent/20 uppercase">
                {product.category}
              </span>
              <h1 className="text-2xl font-extrabold text-foreground">{product.title}</h1>
              <p className="text-xs text-muted-foreground">{product.shortDescription}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-accent">{formatIDR(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">{formatIDR(product.originalPrice)}</span>
              )}
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-3.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Beli Sekarang
            </button>

            {/* Technical Specifications */}
            <div className="divide-y divide-border text-xs pt-2">
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground">Format File</span>
                <span className="font-semibold text-foreground">{product.fileFormats?.join(", ") || "-"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground">Ukuran File</span>
                <span className="font-semibold text-foreground">{product.fileSize || "-"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground">Software</span>
                <span className="font-semibold text-foreground">{product.softwareRequired?.join(", ") || "-"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground">Seller</span>
                <span className="font-semibold text-accent hover:underline">
                  <Link href={`/sellers/${product.sellerId}`}>{product.sellerName}</Link>
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Policy Card */}
          <div className="bg-surface/40 border border-border rounded-xl p-5 space-y-4">
            <div className="flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">Dual-Channel Delivery</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Link Google Drive akan langsung muncul di halaman sukses setelah pembayaran Midtrans terverifikasi. Link backup juga dikirim ke email Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <div className="space-y-6 border-t border-border pt-12">
          <h3 className="text-xl font-bold text-foreground">Produk Serupa</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-colors"
              >
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img src={p.thumbnail} alt={p.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-foreground truncate group-hover:text-accent">{p.title}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-accent font-bold">{formatIDR(p.price)}</p>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-[10px] text-muted-foreground line-through">{formatIDR(p.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
