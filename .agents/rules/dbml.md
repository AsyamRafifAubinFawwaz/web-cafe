---
trigger: manual
---

Table users [headercolor: #175e7a] {
  id int [pk, increment, not null]
  name varchar [not null]
  email varchar
  email_verified_at timestamp
  password varchar [not null]
  remember_token varchar
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int

  Note: 'Tabel user utama (admin, kasir, owner)'
}

Table categories {
  id int [pk, increment]
  type varchar [note: "'makanan' atau 'minuman'"]
  name varchar [note: "e.g., Espresso, Mocktail"]
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table menus {
  id int [pk, increment]
  category_id int [ref: > categories.id]
  name varchar [note: "Nama menu, e.g., Capuccino"] 
  description text [note: "Deskripsi singkat menu"] 
  price int [note: "Harga normal menu, e.g., 10000"] 
  image varchar [note: "URL/Path gambar menu"]
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table promos {
  id int [pk, increment]
  menu_id int [ref: > menus.id, note: "Terhubung langsung ke menu yang dipromokan"]
  title varchar [note: "Judul promo, e.g., Promo Special Americano"]
  image varchar [note: "Poster promo diskon"] 
  discount_type varchar [note: "'percentage' (persen) atau 'nominal' (potongan rupiah)"]
  discount_value int [note: "Nilai diskon. Misal: 20 untuk 20%, atau 5000 untuk potongan Rp 5.000"]
  promo_price int [note: "Harga final setelah diskon, bisa dihitung otomatis oleh backend / di-hardcode"]
  is_active boolean [default: true, note: "Jika true, maka harga menu di aplikasi otomatis berganti ke promo_price"]
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table galleries {
  id int [pk, increment]
  name varchar
  image varchar
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table reservation_packages {
  id int [pk, increment]
  name varchar [note: "Half Book, Full Book, Rent Event"] 
  price int [note: "Harga sewa, e.g., 0, 80000, 350000"] 
  price_type varchar [note: "'free', 'per_hour'"]
  min_order_per_pax int [note: "Minimal order per orang, e.g., 12000, 15000"] 
  min_capacity int [note: "Kapasitas minimal, e.g., 20, 60"] 
  max_capacity int [note: "Kapasitas maksimal, e.g., 50, 200"] 
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table reservations {
  id int [pk, increment]
  name varchar [note: "Nama Koordinator / Penanggung Jawab"]
  phone varchar
  reservation_date datetime
  package_id int [ref: > reservation_packages.id]
  status varchar [note: "'pending', 'approved', 'invoiced', 'paid', 'completed', 'cancelled'"]
  input_method varchar [note: "'manual', 'room_link'"]
  room_link_token varchar [note: "Token unik untuk Opsi Room Reservasi, null jika manual"]
  total_amount int [note: "Grand total dari semua pesanan anggota + biaya paket"]
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table reservation_members {
  id int [pk, increment]
  reservation_id int [ref: > reservations.id]
  name varchar [note: "Nama anggota rombongan, e.g., Dayat, Kukuh"]
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table reservation_items {
  id int [pk, increment]
  reservation_member_id int [ref: > reservation_members.id]
  menu_id int [ref: > menus.id]
  quantity int
  subtotal int
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table invoices {
  id int [pk, increment]
  reservation_id int [ref: > reservations.id]
  invoice_number varchar [unique]
  payment_status varchar [note: "'unpaid', 'paid'"]
  payment_method varchar [note: "'transfer', 'cash', 'qris'"]
  issued_at timestamp
  paid_at timestamp
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table table_orders {
  id int [pk, increment]
  table_number varchar
  status varchar [note: "'pending', 'cooking', 'served', 'paid'"]
  payment_method varchar [note: "'pay_at_cashier', 'online_payment'"]
  total_amount int
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}

Table table_order_items {
  id int [pk, increment]
  table_order_id int [ref: > table_orders.id]
  menu_id int [ref: > menus.id]
  quantity int
  subtotal int
  created_at timestamp
  created_by int [not null, default: 0]
  updated_at timestamp
  updated_by int
  deleted_at datetime
  deleted_by int
}