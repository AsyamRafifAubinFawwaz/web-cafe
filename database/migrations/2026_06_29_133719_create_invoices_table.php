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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->restrictOnDelete();
            $table->string('invoice_number')->unique();
            $table->enum('payment_status', ['unpaid', 'paid','cancelled'])->comment("'unpaid', 'paid', 'cancelled'");
            $table->enum('payment_method', ['transfer', 'cash', 'qris'])->comment("'transfer', 'cash', 'qris'")->nullable();
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('paid_at')->nullable();
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
        Schema::dropIfExists('invoices');
    }
};
