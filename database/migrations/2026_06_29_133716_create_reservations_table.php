<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment("Nama Koordinator / Penanggung Jawab");
            $table->string('phone')->nullable();
            $table->dateTime('reservation_date');
            $table->foreignId('package_id')->constrained('reservation_packages')->restrictOnDelete();
            $table->string('status')->comment("'pending', 'approved', 'invoiced', 'paid', 'completed', 'cancelled'");
            $table->string('input_method')->comment("'manual', 'room_link'");
            $table->string('room_link_token')->nullable()->comment("Token unik untuk Opsi Room Reservasi, null jika manual");
            $table->integer('total_amount')->comment("Grand total dari semua pesanan anggota + biaya paket");
            $table->timestamps();
            $table->integer('created_by')->default(0);
            $table->integer('updated_by')->nullable();
            $table->softDeletes();
            $table->integer('deleted_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
