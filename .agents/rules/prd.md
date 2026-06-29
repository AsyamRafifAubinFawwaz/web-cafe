---
trigger: manual
---

# PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Nama Produk:** MOTRACK CAFE SOLUTION  
**Platform:** Web Platform Terintegrasi (CMS-Driven)  
**Versi:** 1.0  
**Target Pengguna:** Admin Kafe (Owner, Kasir, Admin) & Pelanggan  

---

## 1. Executive Summary

Operasional kafe konvensional kerap menghadapi hambatan besar akibat pengelolaan data yang terfragmentasi. Ketergantungan pada pencatatan manual membatasi skalabilitas, meningkatkan risiko kesalahan manusia (*human error*), serta memicu kerugian finansial akibat pembatalan sepihak (*no-show*). MOTRACK CAFE SOLUTION hadir sebagai solusi ekosistem *Cafe Digital System* berbasis web platform terintegrasi yang dinamis (*CMS-driven*). Sistem ini dirancang sebagai pusat kendali operasional yang ringan, cepat, aman, dan mudah dikelola oleh admin maupun pelanggan.

Produk ini dikembangkan secara modular melalui tiga tingkatan layanan (Smart, Pro, Premium) untuk mengakomodasi skala bisnis mitra kafe. Dengan mengintegrasikan sistem manajemen menu, manajemen paket reservasi acara (seperti *Half Book*, *Full Book*, atau *Rent Event*), koordinasi pesanan grup lewat *Room Link*, hingga pemesanan langsung di tempat via kode QR, platform ini mengubah pola kerja konvensional yang tidak teratur menjadi lini operasional yang terstruktur, aman, dan berbasis data.

Nilai tambah (*value proposition*) utama dari platform ini terletak pada arsitektur datanya yang saling tersinkronisasi. Setiap pesanan pelanggan—baik melalui jalur reservasi prabayar maupun pemesanan meja langsung (*on-site*)—secara otomatis memicu pembuatan invoice digital, mengunci slot kapasitas meja, merekam riwayat transaksi keuangan, serta siap diintegrasikan dengan modul pelacakan inventaris bahan baku demi mencegah kebocoran profitabilitas kafe.

---

## 2. Problem Statement & User Personas

### Pain Points
* **Kerugian Finansial Akibat *No-Show* pada Reservasi Acara:** Kafe sering kehilangan potensi pendapatan besar ketika kelompok/komunitas memesan area (*space booking*) secara manual tanpa komitmen biaya, lalu membatalkannya secara sepihak pada hari-H.
* **Kompleksitas Pesanan Rombongan (Group Booking):** Koordinator rombongan kesulitan mengumpulkan pesanan dari banyak anggota. Admin kafe pun kewalahan merekap daftar pesanan panjang yang dikirim secara tidak terstruktur lewat aplikasi pesan instan.
* **Silos Data Antara Pesanan Meja (*On-Site*) dan Reservasi Acara:** Ketiadaan sistem tunggal membuat kasir harus memisahkan pencatatan antara pelanggan yang makan di tempat via QR Code dengan pelanggan yang melakukan reservasi tempat dari jauh hari, memicu kekacauan laporan keuangan harian.

### User Personas

#### Persona 1: Admin / Operasional Kafe
* **Demografi:** Angga, 29 tahun, Admin Utama & Kasir Kafe.
* **Tujuan:** Mengelola ketersediaan paket reservasi, memvalidasi pembayaran uang muka (DP), mengubah status menu habis secara instan, dan memantau antrean dapur tanpa kertas.
* **Frustrasi:** Menghabiskan waktu menyalin pesanan dari chat WhatsApp dan sering salah mengidentifikasi item menu yang dipesan oleh anggota rombongan besar.

#### Persona 2: Koordinator Pelanggan (Rombongan)
* **Demografi:** Siska, 24 tahun, Sekretaris Komunitas / Pekerja Kantor.
* **Tujuan:** Memesan area kafe untuk acara kumpul bersama (*gathering*) sekaligus mendata pesanan makanan dari belasan anggota secara akurat dan cepat.
* **Frustrasi:** Harus menanyakan satu per satu pesanan temannya, merekapnya manual ke teks WhatsApp, dan tidak mendapatkan transparansi rincian biaya per orang dari pihak kafe.

---

## 3. Product Vision & Success Metrics (KPIs)

### Product Vision
Menjadi infrastruktur operasi digital terpadu bagi industri kafe modern dengan menyediakan manajemen konten dinamis, sistem reservasi rombongan berbasis *room-token* yang bebas risiko kerugian, serta otomatisasi transaksi meja *real-time*.

### Success Metrics (KPIs)
* **Pencegahan Kerugian Kehadiran (*No-Show Reduction*):** Menurunkan tingkat pembatalan sepihak untuk reservasi area hingga di bawah 5% melalui penegakan sistem *Auto-Generate Invoice* dengan prasyarat DP 50%.
* **Efisiensi Rekapitulasi Pesanan Grup:** Memangkas waktu pemrosesan pesanan rombongan dari rata-rata 30 menit menjadi kurang dari 5 menit menggunakan metode *Room Link Token*.
* **Kecepatan Pembaruan Konten (*CMS Agility*):** Mengurangi waktu yang dibutuhkan admin untuk memperbarui harga menu atau mengunggah promo dari hitungan hari menjadi hitungan detik langsung dari dasbor admin.
* **Kecepatan Layanan Meja (*Table Order Velocity*):** Mempercepat penyampaian pesanan dari meja pelanggan ke antrean dapur hingga 50% lewat jalur mandiri pemindaian QR Code (`table_orders`).

---

## 4. Scope & Features (MoSCoW Framework)

| Nama Fitur | Deskripsi / Tujuan | Prioritas | Entitas DB Terkait |
| :--- | :--- | :--- | :--- |
| **Landing Page & Profil** | Menampilkan identitas, jam operasional, fasilitas, dan visi-misi kafe secara dinamis dari database. | **Must-have** (Smart) | `users` |
| **CMS Katalog Menu & Kategori** | Fitur CRUD untuk admin mengelola kategori dan menu (nama, foto, deskripsi, harga normal) secara mandiri. | **Must-have** (Smart) | `categories`, `menus` |
| **Galeri Foto Dinamis** | Manajemen unggah dan hapus foto suasana kafe serta fasilitas penunjang untuk *visual branding*. | **Must-have** (Smart) | `galleries` |
| **Tombol CTA & Integrasi Maps** | Navigasi lokasi fisik kafe via Google Maps dan tautan komunikasi instan ke WhatsApp admin. | **Must-have** (Smart) | - |
| **Dashboard Admin Sentral** | Panel kontrol utama multi-role (admin, kasir, owner) untuk memantau aktivitas operasional secara harian. | **Must-have** (Pro) | `users` |
| **Sistem Reservasi & Paket Acara** | Modul pemesanan tempat instan tanpa login berdasarkan pilihan paket kapasitas (*Half/Full Book*) dan nominal harga tertentu. | **Must-have** (Pro) | `reservation_packages`, `reservations` |
| **Auto-Invoice & DP Otomatis** | Pembuatan nomor invoice unik secara otomatis setelah pesanan divalidasi admin untuk menarik tagihan DP 50%. | **Must-have** (Pro) | `invoices`, `reservations` |
| **1-Click WA Confirmation** | Integrasi tombol dasbor untuk mengirimkan link token reservasi atau link invoice langsung ke WhatsApp pengguna. | **Must-have** (Pro) | `reservations` |
| **Sistem Room Link Token** | Fitur pembuatan token unik bagi koordinator reservasi agar anggota rombongan dapat menginput pesanan mereka sendiri. | **Should-have** (Pro) | `reservation_members`, `reservation_items` |
| **Smart Manajemen Promo** | Fitur penambahan diskon (persentase/nominal) pada menu tertentu yang otomatis mengubah harga jual saat statusnya aktif. | **Should-have** (Pro) | `promos`, `menus` |
| **Pemesanan Mandiri QR Code** | Antarmuka digital bagi pelanggan di lokasi kafe untuk memesan makanan langsung dari meja tanpa melibatkan kasir fisik. | **Should-have** (Premium) | `table_orders`, `table_order_items` |
| **Manajemen Stok Real-Time** | Sinkronisasi otomatis pengurangan bahan baku gudang pasca-transaksi berdasarkan komposisi resep menu. | **Could-have** (Premium) | - |
| **Aplikasi Mobile Native** | Pembuatan aplikasi mandiri iOS/Android di luar platform web utama. | **Won't-have** | - |

---

## 5. Database Schema (Struktur Data)

Database schema berada di file md @dbml


6. Detailed 2-Option User Flows (Reservasi)
🛠️ Opsi 1: Input Manual Satu Per Satu
Koordinator mengisi data utama form reservasi (Nama, No WA, Tanggal, Paket).

Di halaman yang sama, terdapat baris dinamis di mana Koordinator mengetik nama anggota, memilih menu dari dropdown, mengisi jumlah, lalu mengklik "Tambah Anggota Lagi".

Sistem menyimpan baris tersebut ke reservation_members dan reservation_items secara langsung.

🔗 Opsi 2: Metode Link Room Reservasi (Real-time Database Session)
Koordinator mengisi data utama form reservasi, lalu sistem menghasilkan link unik berbasis token (room_link_token) yang berlaku aktif selama 24 jam.

Koordinator membagikan link room tersebut ke grup WhatsApp.

Setiap anggota mengklik link, masuk ke halaman ruang tunggu digital bersama, menginput nama mereka, dan memesan menu secara mandiri.

Pilihan menu langsung tersimpan secara real-time ke database, dan Koordinator dapat melihat pergerakan pembaruan daftar pesanan rombongan secara langsung di layar monitornya.

Koordinator mengklik tombol "Kunci Ruangan & Kirim ke Kafe" untuk mengakhiri sesi.


