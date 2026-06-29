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
            $table->string('status')->comment("'pending', 'cooking', 'served', 'paid'");
            $table->string('payment_method')->nullable()->comment("'pay_at_cashier', 'online_payment'");
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
