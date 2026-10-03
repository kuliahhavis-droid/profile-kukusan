# 🍠 Kukusan Gen Z - Web Profil & Pemesanan Online UMKM

Website profil usaha dan katalog pemesanan online untuk **Kukusan Gen Z** (Lapak jajanan sehat di depan Ketapang Kost 2, Dukuhwaluh, Banyumas). Dibuat menggunakan **Next.js 15 App Router, React 19, Tailwind CSS, TypeScript, Neon PostgreSQL (Drizzle ORM), dan Cloudinary**.

---

## 🌟 Fitur Utama Website

1. **Halaman Publik / Pembeli (`/`):**
   * **Hero Banner Dinamis:** Headline promosi, badge jam buka lapak (06.00 WIB - Habis), dan siap antar area Kampus UMP 1.
   * **Katalog Menu Interaktif:** Varian kukusan serba Rp 2.000 (Pisang, Ubi Oren, Ubi Ungu, Singkong, Talas, Kentang, Jagung) dan Paket Hemat 5K Dapet 3 Pcs.
   * **Keranjang Belanja Cerdas (Drawer Cart):** Formulir pemesanan ringkas (Nama, Alamat/Kampus, Metode Bayar, Keterangan Varian) dengan penyimpanan otomatis (*localStorage*) dan tombol langsung kirim format order ke WhatsApp.
   * **Tentang Lapak & Keunggulan:** Informasi stand nyata, bebas minyak 100%, testimoni pelanggan, dan Google Maps terintegrasi.
   * **Navigasi Mobile & Footer Responsif:** Menu laci off-canvas pada HP dan footer kontras tinggi.
   * **SEO & Google Search Ready:** Sitemap XML, Robots.txt, Meta Tags, dan JSON-LD Structured Data Local Business.

2. **Panel Pengelola Admin (`/admin`):**
   * **Ringkasan Toko / Dashboard:** Metrik total menu, menu aktif, menu unggulan, dan status operasional.
   * **Kelola Menu (`/admin/products`):** Tambah menu baru, edit harga/deskripsi, upload foto menu langsung dari HP/laptop, toggle status aktif 1-klik, toggle unggulan bintang, dan custom pop-up konfirmasi hapus menu.
   * **Pengaturan Toko & WhatsApp (`/admin/content`):** Ganti nomor WhatsApp tujuan order, nama brand, tagline, alamat stand Ketapang Kost 2, jam buka, headline banner, dan foto lapak.
   * **Proteksi Keamanan:** Auth Cookies, HTTP Security Headers, MIME Type & File Size Validation.

---

## 🧪 Panduan Uji Coba Semua Fitur (Testing Checklist)

Silakan coba langkah-langkah berikut di browser Anda (`http://localhost:3000`):

### 1. Uji Coba Halaman Utama & Keranjang Belanja:
1. Buka `http://localhost:3000`.
2. Klik tombol **"+ Keranjang"** pada beberapa menu (misal: Pisang Kukus & Paket Hemat 5K).
3. Klik ikon keranjang belanja di pojok kanan atas.
4. Di dalam laci keranjang, isi **Nama**, **Alamat/Kampus**, pilih **Metode Bayar**, dan ketik **Catatan varian**.
5. Klik **"Pesan Sekarang via WhatsApp"** — Browser akan otomatis membuka WhatsApp dengan teks pesanan yang rapi dan terhitung total harganya.

### 2. Uji Coba Panel Admin:
1. Buka `http://localhost:3000/admin/login`.
2. Masukkan akun admin:
   * **Email:** `admin@kukusangenz.com`
   * **Password:** `admin123`
3. Masuk ke menu **Kelola Menu** (`/admin/products`):
   * Klik **"+ Tambah Menu"**, ketik nama menu baru, harga Rp 2.000, dan klik **Upload** untuk memilih foto. Klik **Simpan Menu**.
   * Klik tombol **Aktif / Nonaktif** untuk menguji perubahan status tayang menu.
   * Klik ikon **Bintang** untuk menandai menu unggulan.
   * Klik ikon **Tempat Sampah** untuk mencoba pop-up konfirmasi hapus modern.
4. Masuk ke menu **Info Lapak & WA** (`/admin/content`):
   * Ubah nomor WhatsApp atau teks headline, lalu klik **Simpan**.

---

## 🚀 Panduan Hosting Gratis ke Vercel

### Langkah 1: Upload Kode ke GitHub
```bash
git init
git add .
git commit -m "Initial commit Kukusan Gen Z ready for hosting"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/profile-kukusan.git
git push -u origin main
```

### Langkah 2: Deploy di Vercel
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub.
2. Klik **"Add New Project"** dan pilih repositori `profile-kukusan`.
3. Di bagian **Environment Variables**, tambahkan:
   * `DATABASE_URL` = *(URL PostgreSQL dari Neon.tech)*
   * `CLOUDINARY_CLOUD_NAME` = *(Cloud name dari Cloudinary)*
   * `CLOUDINARY_API_KEY` = *(API key Cloudinary)*
   * `CLOUDINARY_API_SECRET` = *(API secret Cloudinary)*
   * `NEXTAUTH_SECRET` = *(Ketik teks acak min 32 karakter)*
   * `ADMIN_EMAIL` = `admin@kukusangenz.com`
   * `ADMIN_PASSWORD` = `admin123`
   Tombol **Gunakan lokasi saya** memakai Geolocation API bawaan browser, jadi tidak memerlukan Google Maps API key. Pengguna harus memberikan izin lokasi pada browser.
4. Klik **Deploy**. Website Anda akan aktif dalam 1-2 menit dengan domain gratis `https://nama-projek.vercel.app`.
