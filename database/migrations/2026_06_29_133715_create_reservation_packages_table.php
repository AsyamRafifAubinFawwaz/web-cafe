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
        Schema::create('reservation_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment("Half Book, Full Book, Rent Event");
            $table->integer('price')->comment("Harga sewa, e.g., 0, 80000, 350000");
            $table->string('price_type')->comment("'free', 'per_hour'");
            $table->integer('min_order_per_pax')->comment("Minimal order per orang, e.g., 12000, 15000");
            $table->integer('min_capacity')->comment("Kapasitas minimal, e.g., 20, 60");
            $table->integer('max_capacity')->comment("Kapasitas maksimal, e.g., 50, 200");

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
        Schema::dropIfExists('reservation_packages');
    }
};
