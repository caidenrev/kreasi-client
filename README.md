# Kreasi.id — Storefront Client

Ini adalah antarmuka utama tempat pembeli dapat menjelajahi katalog produk digital, mencari, memfilter, dan melakukan checkout.

## Prasyarat
Pastikan Anda sudah menjalankan `pnpm install` dari root direktori proyek.

## Konfigurasi Environment Variables

Buat file `.env.local` di dalam folder `client/` ini, dan isi dengan kredensial Firebase dan Midtrans Anda:

```env
# Konfigurasi Firebase (Dapatkan dari Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Konfigurasi Midtrans Client Key (Untuk memuat Snap JS)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-XXXXX

# Base URL Aplikasi (Digunakan untuk notifikasi email & webhook redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Menjalankan Server Development

Jalankan perintah berikut di dalam direktori `client/`:

```bash
pnpm dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## Fitur Utama
- **Katalog Produk:** Pencarian dan filter dinamis (Kategori, Harga) yang berjalan di client-side.
- **Produk Detail:** Halaman lengkap produk dengan ulasan dan spesifikasi.
- **Checkout Midtrans:** Popup pembayaran Midtrans Snap diintegrasikan langsung tanpa redirect halaman.
- **Real-time Order Status:** Menunggu webhook backend dan memunculkan notifikasi sukses otomatis di UI.
