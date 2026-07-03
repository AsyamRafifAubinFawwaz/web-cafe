<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * .
     */
    public function up(): void
    {
        Schema::create('reservation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_member_id')->constrained('reservation_members')->restrictOnDelete();
            $table->foreignId('menu_id')->constrained('menus')->restrictOnDelete();
            $table->integer('quantity');
            $table->integer('subtotal');
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
        Schema::dropIfExists('reservation_items');
    }
};
