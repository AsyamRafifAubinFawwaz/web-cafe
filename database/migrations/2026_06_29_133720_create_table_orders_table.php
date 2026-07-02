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
        Schema::create('table_orders', function (Blueprint $table) {
            $table->id();
            $table->string('table_number');
            $table->enum('status', ['pending', 'cooking', 'served', 'paid'])->default('pending');
            $table->enum('payment_method', ['pay_at_cashier', 'online_payment'])->default('pay_at_cashier');
            $table->integer('total_amount');
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
        Schema::dropIfExists('table_orders');
    }
};
