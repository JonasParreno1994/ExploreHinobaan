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
        Schema::table('enterprise_order_settings', function (Blueprint $table) {
            $table->boolean('allows_order_cancellation')->default(true);
            $table->unsignedSmallInteger('cancellation_window_hours')->nullable()->default(24);
            $table->boolean('allows_refunds')->default(false);
            $table->unsignedSmallInteger('refund_window_days')->nullable()->default(7);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enterprise_order_settings', function (Blueprint $table) {
            $table->dropColumn(['allows_order_cancellation', 'cancellation_window_hours', 'allows_refunds', 'refund_window_days']);
        });
    }
};
