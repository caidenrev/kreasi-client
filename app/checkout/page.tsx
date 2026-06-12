"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, CreditCard, ShieldCheck, Ticket, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Declare window interface for Midtrans Snap CDN script
declare global {
  interface Window {
    snap: any;
  }
}

const checkoutSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(9, "Nomor WhatsApp tidak valid"),
});

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!appliedVoucher || cart.length === 0) {
      setDiscountAmount(0);
      return;
    }

    const eligibleTotal = cart
      .filter((item) => item.sellerId === appliedVoucher.sellerId)
      .reduce((sum, item) => sum + item.price, 0);

    if (eligibleTotal === 0) {
      toast.error("Voucher tidak berlaku untuk produk di keranjang ini.");
      setAppliedVoucher(null);
      setDiscountAmount(0);
      return;
    }

    let discount = 0;
    if (appliedVoucher.discountType === "percentage") {
      discount = (eligibleTotal * appliedVoucher.discountValue) / 100;
    } else if (appliedVoucher.discountType === "fixed") {
      discount = appliedVoucher.discountValue;
      if (discount > eligibleTotal) {
        discount = eligibleTotal;
      }
    }

    setDiscountAmount(discount);
  }, [cart, appliedVoucher]);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);

    try {
      const q = query(collection(db, "vouchers"), where("code", "==", voucherCode.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Voucher tidak ditemukan.");
        setVoucherLoading(false);
        return;
      }

      const vData = querySnapshot.docs[0].data();

      if (!vData.isActive) {
        toast.error("Voucher sudah tidak aktif.");
        setVoucherLoading(false);
        return;
      }

      if (new Date(vData.expiresAt).getTime() < new Date().getTime()) {
        toast.error("Voucher sudah kadaluarsa.");
        setVoucherLoading(false);
        return;
      }

      const hasEligibleProduct = cart.some(item => item.sellerId === vData.sellerId);
      if (!hasEligibleProduct) {
        toast.error("Voucher tidak berlaku untuk produk di keranjang ini.");
        setVoucherLoading(false);
        return;
      }

      setAppliedVoucher({
        id: querySnapshot.docs[0].id,
        ...vData
      });
      toast.success("Voucher berhasil digunakan!");
      setVoucherCode("");
    } catch (error) {
      console.error("Error applying voucher:", error);
      toast.error("Gagal mengecek voucher.");
    } finally {
      setVoucherLoading(false);
    }
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const handleCheckoutSubmit = async (values: z.infer<typeof checkoutSchema>) => {
    if (cart.length === 0) {
      toast.error("Keranjang belanja kosong");
      return;
    }
    setLoading(true);

    const finalAmount = cartTotal - discountAmount;

    try {
      const response = await fetch("/api/midtrans/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyer: values,
          items: cart.map((item) => ({
            productId: item.id,
            productTitle: item.title,
            sellerId: item.sellerId,
            sellerName: item.sellerName,
            price: item.price,
          })),
          totalAmount: finalAmount > 0 ? finalAmount : 0,
          voucherCode: appliedVoucher ? appliedVoucher.code : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat transaksi.");
      }

      const { snapToken, orderId } = data;

      // Open Midtrans Snap Modal
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function (result: any) {
            clearCart();
            router.push(`/success?order_id=${orderId}`);
          },
          onPending: function (result: any) {
            clearCart();
            router.push(`/success?order_id=${orderId}`);
          },
          onError: function (result: any) {
            toast.error("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: function () {
            toast.warning("Pembayaran dibatalkan.");
          },
        });
      } else {
        throw new Error("Midtrans Snap SDK tidak termuat. Periksa koneksi internet Anda.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
      {/* Back to Catalog */}
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Batal & Kembali ke Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Form Info */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Data Pembeli</CardTitle>
            <CardDescription className="text-muted-foreground">
              Isi formulir untuk mendapatkan link unduhan digital.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCheckoutSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-semibold">NAMA LENGKAP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Eka Revandi"
                          className="bg-surface-2 border-border text-foreground focus-visible:ring-accent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-semibold">EMAIL AKTIF (UNTUK BACKUP LINK)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Eka@email.com"
                          className="bg-surface-2 border-border text-foreground focus-visible:ring-accent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-semibold">NOMOR HANDPHONE (WA)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="08123456789"
                          className="bg-surface-2 border-border text-foreground focus-visible:ring-accent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-6 rounded-lg text-sm mt-4"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {loading ? "Memproses Token..." : "Bayar Sekarang"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right Column: Order Summary */}
        <Card className="bg-surface border-border flex flex-col justify-between">
          <CardContent className="pt-6 space-y-6">
            <h3 className="text-lg font-bold border-b border-border pb-3 text-foreground">Ringkasan Pembelian</h3>

            {cart.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">Keranjang belanja kosong.</p>
            ) : (
              <div className="divide-y divide-border max-h-[250px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3 items-center justify-between text-xs">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-10 h-10 rounded object-cover border border-border bg-black"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.title}</p>
                      <p className="text-muted-foreground">by {item.sellerName}</p>
                    </div>
                    <span className="font-bold text-foreground flex-shrink-0">{formatIDR(item.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <CardContent className="border-t border-border pt-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan Kode Voucher"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="bg-surface-2 border-border text-foreground focus-visible:ring-accent uppercase"
                disabled={voucherLoading || !!appliedVoucher}
              />
              {appliedVoucher ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setAppliedVoucher(null);
                    setDiscountAmount(0);
                  }}
                  className="px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleApplyVoucher}
                  disabled={voucherLoading || !voucherCode.trim()}
                  className="bg-accent hover:bg-accent-hover text-black font-semibold"
                >
                  {voucherLoading ? "Cek..." : "Terapkan"}
                </Button>
              )}
            </div>

            {appliedVoucher && (
              <div className="flex justify-between items-center text-sm text-emerald-400 font-medium">
                <span className="flex items-center gap-1">
                  <Ticket className="w-4 h-4" /> Diskon Voucher ({appliedVoucher.code})
                </span>
                <span>-{formatIDR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total Bayar:</span>
              <span className="text-2xl font-extrabold text-accent">{formatIDR(cartTotal - discountAmount > 0 ? cartTotal - discountAmount : 0)}</span>
            </div>

            <div className="bg-surface-2 border border-border rounded-lg p-3 text-[11px] text-muted-foreground flex gap-2 items-start">
              <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
              <span>
                Pembayaran diproses dengan aman menggunakan server payment gateway resmi Midtrans.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
