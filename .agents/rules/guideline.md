---
trigger: manual
---

# TECHNICAL & ARCHITECTURAL GUIDELINE

**Nama Produk:** MOTRACK CAFE SOLUTION  
**Tujuan:** Panduan penulisan logika kode, regulasi status transaksi, dan pengamanan data.

---

## 1. Aturan Validasi Menu & Kategori Berlapis

*   **Struktur Filter Konten:** Saat merender halaman buku menu digital, sistem wajib melakukan pengelompokan tingkat pertama berdasarkan kolom `categories.type` ('makanan' atau 'minuman'), dilanjutkan dengan pengelompokan tingkat kedua berdasarkan `categories.name` (Sub-Kategori, e.g., Espresso, Coffee, Non-Coffee).
*   **Validasi Relasi Penghapusan:** Data pada tabel `categories` dilarang keras dihapus (soft delete) apabila masih terdapat data anak di tabel `menus` yang menggunakan `category_id` terkait (ON DELETE RESTRICT behavior).

---

## 2. Logika Masa Berlaku Room Link Token (Opsi 2)

Ketika data `reservations` dibuat menggunakan `input_method = 'room_link'`, kolom `room_link_token` diisi string acak unik dan `created_at` mencatat waktu pembuatan.

Sebelum mengizinkan anggota memasukkan data ke tabel `reservation_members`, middleware backend wajib melakukan pengecekan:
$$\text{Selisih Waktu} = \text{Waktu Sekarang} - \text{created\_at}$$

*   **Mekanisme Kunci:** Jika $\text{Selisih Waktu} > 24\text{ Jam}$ dan status reservasi saat ini masih `'pending'` atau `'approved'`, kunci akses room, ubah status menjadi `'cancelled'`, dan kembalikan kode status HTTP 403 Forbidden dengan pesan "Link Room Reservasi Telah Kedaluwarsa (Batas Waktu 24 Jam).".
*   *Catatan Keamanan:* Jika status reservasi sudah `'invoiced'`, `'paid'`, atau `'completed'`, status tidak boleh diubah otomatis menjadi `'cancelled'` saat link diakses kembali di kemudian hari.

---

## 3. Dua Tahap Validasi Admin (2-Step Admin Approval)

Untuk menghindari kesalahpahaman pesanan, alur kerja admin wajib mengikuti urutan berikut:

*   **Tahap 1 (Tombol ACC / Approve):**
    1. Admin memeriksa ketersediaan ruang fisik kafe.
    2. Admin mengklik tombol "Approve". Status di tabel `reservations` berubah menjadi `'approved'`.
    3. Sistem memicu pengiriman rincian rekapitulasi data ke nomor WhatsApp Koordinator: Nama Koor, Paket, Tanggal, Rincian Pesanan per Nama Anggota, dan Total Perhitungan Biaya.
*   **Tahap 2 (Tombol Kirim Invoice):**
    1. Setelah Koordinator memberikan konfirmasi balik bahwa data telah sesuai, Admin menekan tombol "Terbitkan Invoice".
    2. Sistem membuat nomor invoice unik di tabel `invoices` dengan status `'unpaid'`, menghitung nilai uang muka (DP) 50%, dan mengirimkan link pembayaran elektronik ke WhatsApp pelanggan.

---

## 4. Sinkronisasi Kasir & QR Order (Premium Gacoan Style)

*   **Pemesanan Tanpa Pelayan:** Pemindaian QR Code meja langsung menyuntikkan data nomor meja ke field `table_orders.table_number` tanpa proses login.
*   **Isolasi State:** Pesanan QR Meja direkam langsung ke tabel `table_orders` dan `table_order_items`. Transaksi ini tidak memiliki keterkaitan relasi kunci dengan ekosistem tabel `reservations` demi menjaga performa pembacaan data kasir tetap terisolasi dengan rapi.
*   **Pilihan Checkout Fleksibel:** Field `payment_method` wajib mengakomodasi dua nilai baku: `'pay_at_cashier'` (Kasir memproses penutupan status pembayaran secara manual di meja kasir fisik) atau `'online_payment'` (Sistem menutup status pembayaran secara otomatis via Web Payment Gateway hook).



## 6. Standar Format Respons API

Semua komunikasi data endpoint API wajib menggunakan format JSON standar berikut ini demi konsistensi integrasi tim front-end dan back-end:

### Respons Berhasil (Success Response)
```json
{
  "success": true,
  "message": "Data berhasil diproses.",
  "data": {}
}

```

### Respons Gagal (Error Response)

```json
{
  "success": false,
  "message": "Pesan kegagalan atau validasi bisnis yang spesifik.",
  "errors": []
}

```

```

```