---
trigger: manual
---

TASK BACKLOG & FEATURE CHECKLIST
Nama Produk: MOTRACK CAFE SOLUTION

Tujuan: Panduan pengerjaan bertahap (vibe coding checklist) untuk mengimplementasikan fitur pembaharuan sistem secara sistematis.

🍱 TAHAP 1: IMPLEMENTASI CMS & KATALOG BERLAPIS
[ ] Task 1.1: Pembuatan Fitur CRUD Kategori Dinamis (categories)

Bangun antarmuka form admin untuk memasukkan nama kategori beserta seleksi tipe (makanan / minuman).

[ ] Task 1.2: Pembuatan Fitur CRUD Menu Komprehensif (menus)

Buat form admin mencakup unggah gambar, input judul/nama menu, deskripsi singkat, relasi sub-kategori, dan harga normal.

[ ] Task 1.3: Pembuatan Fitur CRUD Poster Promo Diskon (promos)

Bangun modul input poster promo diskon yang terhubung dengan data ID menu.

Tulis logika kalkulasi otomatis nilai promo_price di tingkat backend berdasarkan pilihan jenis potongan (percentage / nominal).

[ ] Task 1.4: Pembuatan Fitur CRUD Galeri Sederhana (galleries)

Sediakan halaman kelola unggah gambar suasana kafe yang hanya memuat kolom nama judul gambar dan berkas file foto.

📅 TAHAP 2: ENGINE RESERVASI KELOMPOK MULTI-OPSI (PAKET PRO)
[ ] Task 2.1: Pembuatan Komponen UI Pemilihan 2 Opsi Input

Bangun komponen tab menu dinamis di halaman web reservasi pelanggan untuk memisahkan antarmuka Opsi 1 (Input Manual) dan Opsi 2 (Room Link).

[ ] Task 2.2: Implementasi Logika Teknis Per Opsi Input

[ ] Opsi 1: Buat form entri dinamis (penambahan baris baris nama & menu secara fleksibel dengan tombol add-row javascript).

[ ] Opsi 2: Buat logika pembentukan link khusus ber-token (room_link_token). Implementasikan expiration check berdurasi 24 jam di level middleware backend.

[ ] Task 2.3: Pengerjaan Alur Kerja Validasi Admin 2 Tahap (2-Step Approval)

[ ] Langkah 1: Buat tombol aksi "Approve" di dashboard untuk mengubah status reservasi menjadi approved sekaligus memicu pembuatan format teks rekapitulasi data pesanan kelompok untuk dikirim ke nomor WhatsApp Koordinator.

[ ] Langkah 2: Buat tombol aksi lanjutan "Terbitkan Invoice" yang akan mengeksekusi pembuatan data unik baru pada tabel invoices serta menghitung nilai DP 50%.

⚡ TAHAP 3: SISTEM QR CODE MEJA (PAKET PREMIUM)
[ ] Task 3.1: Konstruksi Antarmuka Menu QR Lokasi Meja (table_orders)

Bangun halaman menu khusus pelanggan yang otomatis mendeteksi parameter query nomor meja (e.g., /order?meja=08).

Sediakan mekanisme pilihan checkout untuk menentukan opsi penutupan transaksi (pay_at_cashier / online_payment).

[ ] Task 3.2: Integrasi Sinkronisasi Real-time Monitor Kasir & Dapur

Pasang pustaka WebSocket pada server dan klien dasbor admin kafe.

Pastikan setiap ada transaksi baru dari tabel table_order_items, antrean layar dapur langsung diperbarui secara real-time disertai bunyi notifikasi penanda pesanan masuk.