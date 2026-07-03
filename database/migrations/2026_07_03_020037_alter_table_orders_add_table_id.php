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
        // Truncate tables first to avoid FK constraint violations with existing data
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \Illuminate\Support\Facades\DB::table('table_order_items')->truncate();
        \Illuminate\Support\Facades\DB::table('table_orders')->truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Schema::table('table_orders', function (Blueprint $table) {
            if (Schema::hasColumn('table_orders', 'table_number')) {
                $table->dropColumn('table_number');
            }
            if (!Schema::hasColumn('table_orders', 'table_id')) {
                $table->foreignId('table_id')->after('id')->constrained('tables')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
