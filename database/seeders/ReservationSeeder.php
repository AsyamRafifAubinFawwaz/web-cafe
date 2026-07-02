<?php

namespace Database\Seeders;

use App\Models\Categories;
use App\Models\Menus;
use App\Models\ReservationPackages;
use App\Models\Reservations;
use App\Models\ReservationMembers;
use App\Models\ReservationItems;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $makananCat = Categories::firstOrCreate(
            ['name' => 'Makanan Utama'],
            ['type' => 'makanan']
        );

        $minumanCat = Categories::firstOrCreate(
            ['name' => 'Minuman Dingin'],
            ['type' => 'minuman']
        );

        // 2. Menus
        $nasiGoreng = Menus::firstOrCreate(
            ['name' => 'Nasi Goreng Special'],
            [
                'description' => 'Nasi goreng dengan telur mata sapi dan ayam suwir.',
                'price' => 35000,
                'category_id' => $makananCat->id,
            ]
        );

        $mieGoreng = Menus::firstOrCreate(
            ['name' => 'Mie Goreng Jawa'],
            [
                'description' => 'Mie goreng dengan bumbu tradisional Jawa.',
                'price' => 32000,
                'category_id' => $makananCat->id,
            ]
        );

        $cappuccino = Menus::firstOrCreate(
            ['name' => 'Cappuccino Ice'],
            [
                'description' => 'Kopi espresso dengan foam susu lembut.',
                'price' => 25000,
                'category_id' => $minumanCat->id,
            ]
        );

        $icedLatte = Menus::firstOrCreate(
            ['name' => 'Iced Cafe Latte'],
            [
                'description' => 'Espresso dengan susu murni segar dingin.',
                'price' => 28000,
                'category_id' => $minumanCat->id,
            ]
        );

        // 3. Reservation Packages
        $paketRapat = ReservationPackages::firstOrCreate(
            ['name' => 'Paket Rapat Kantor'],
            [
                'price' => 150000,
                'price_type' => 'per_hour',
                'min_order_per_pax' => 15000,
                'min_capacity' => 10,
                'max_capacity' => 30,
            ]
        );

        $paketUltah = ReservationPackages::firstOrCreate(
            ['name' => 'Paket Ulang Tahun'],
            [
                'price' => 250000,
                'price_type' => 'free',
                'min_order_per_pax' => 20000,
                'min_capacity' => 30,
                'max_capacity' => 80,
            ]
        );

        // 4. Reservations
        // Reservation 1: Pending (Room Link)
        $res1 = Reservations::create([
            'name' => 'Ahmad Royhan',
            'phone' => '081234567890',
            'reservation_date' => now()->addDays(5)->format('Y-m-d H:i:s'),
            'package_id' => $paketRapat->id,
            'status' => 'pending',
            'input_method' => 'room_link',
            'room_link_token' => bin2hex(random_bytes(16)),
            'total_amount' => 0,
        ]);

        $member1_1 = ReservationMembers::create([
            'reservation_id' => $res1->id,
            'name' => 'Ahmad (Koor)',
        ]);

        $member1_2 = ReservationMembers::create([
            'reservation_id' => $res1->id,
            'name' => 'Royhan Partner',
        ]);

        ReservationItems::create([
            'reservation_member_id' => $member1_1->id,
            'menu_id' => $nasiGoreng->id,
            'quantity' => 1,
            'subtotal' => $nasiGoreng->price * 1,
        ]);

        ReservationItems::create([
            'reservation_member_id' => $member1_1->id,
            'menu_id' => $cappuccino->id,
            'quantity' => 1,
            'subtotal' => $cappuccino->price * 1,
        ]);

        ReservationItems::create([
            'reservation_member_id' => $member1_2->id,
            'menu_id' => $mieGoreng->id,
            'quantity' => 1,
            'subtotal' => $mieGoreng->price * 1,
        ]);

        ReservationItems::create([
            'reservation_member_id' => $member1_2->id,
            'menu_id' => $icedLatte->id,
            'quantity' => 1,
            'subtotal' => $icedLatte->price * 1,
        ]);

        // Update total amount of reservation 1
        $res1->update([
            'total_amount' => $paketRapat->price + $nasiGoreng->price + $cappuccino->price + $mieGoreng->price + $icedLatte->price
        ]);

        // Reservation 2: Approved (Manual)
        $res2 = Reservations::create([
            'name' => 'Siti Aminah',
            'phone' => '089876543210',
            'reservation_date' => now()->addDays(7)->format('Y-m-d H:i:s'),
            'package_id' => $paketUltah->id,
            'status' => 'approved',
            'input_method' => 'manual',
            'total_amount' => 0,
        ]);

        $member2_1 = ReservationMembers::create([
            'reservation_id' => $res2->id,
            'name' => 'Siti (Koor)',
        ]);

        $member2_2 = ReservationMembers::create([
            'reservation_id' => $res2->id,
            'name' => 'Aminah Sister',
        ]);

        $member2_3 = ReservationMembers::create([
            'reservation_id' => $res2->id,
            'name' => 'Budi Friend',
        ]);

        ReservationItems::create([
            'reservation_member_id' => $member2_1->id,
            'menu_id' => $nasiGoreng->id,
            'quantity' => 2,
            'subtotal' => $nasiGoreng->price * 2,
        ]);

        ReservationItems::create([
            'reservation_member_id' => $member2_1->id,
            'menu_id' => $cappuccino->id,
            'quantity' => 2,
            'subtotal' => $cappuccino->price * 2,
        ]);

        ReservationItems::create([
            'reservation_member_id' => $member2_2->id,
            'menu_id' => $icedLatte->id,
            'quantity' => 2,
            'subtotal' => $icedLatte->price * 2,
        ]);

        ReservationItems::create([
            'reservation_member_id' => $member2_3->id,
            'menu_id' => $mieGoreng->id,
            'quantity' => 2,
            'subtotal' => $mieGoreng->price * 2,
        ]);

        // Update total amount of reservation 2
        $res2->update([
            'total_amount' => $paketUltah->price + ($nasiGoreng->price * 2) + ($cappuccino->price * 2) + ($icedLatte->price * 2) + ($mieGoreng->price * 2)
        ]);
    }
}
