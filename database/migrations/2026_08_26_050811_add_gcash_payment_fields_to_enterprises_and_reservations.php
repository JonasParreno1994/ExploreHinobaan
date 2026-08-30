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
        Schema::table('enterprises', function (Blueprint $table) {
            $table->decimal('reservation_fee', 12, 2)->nullable();
            $table->string('gcash_qr_path')->nullable();
        });
        Schema::table('reservations', function (Blueprint $table) {
            $table->decimal('reservation_fee', 12, 2)->default(0);
            $table->string('payment_proof_path')->nullable();
            $table->string('payment_status')->default('not_required')->index();
            $table->timestamp('payment_verified_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['reservation_fee', 'payment_proof_path', 'payment_status', 'payment_verified_at']);
        });
        Schema::table('enterprises', function (Blueprint $table) {
            $table->dropColumn(['reservation_fee', 'gcash_qr_path']);
        });
    }
};
