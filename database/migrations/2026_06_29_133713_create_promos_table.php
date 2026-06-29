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
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained('menus')->restrictOnDelete()->comment("Terhubung langsung ke menu yang dipromokan");
            $table->string('title')->comment("Judul promo, e.g., Promo Special Americano");
            $table->string('image')->nullable()->comment("Poster promo diskon");
            $table->string('discount_type')->comment("'percentage' (persen) atau 'nominal' (potongan rupiah)");
            $table->integer('discount_value')->comment("Nilai diskon. Misal: 20 untuk 20%, atau 5000 untuk potongan Rp 5.000");
            $table->integer('promo_price')->comment("Harga final setelah diskon, bisa dihitung otomatis oleh backend / di-hardcode");
            $table->boolean('is_active')->default(true)->comment("Jika true, maka harga menu di aplikasi otomatis berganti ke promo_price");

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
        Schema::dropIfExists('promos');
    }
};
