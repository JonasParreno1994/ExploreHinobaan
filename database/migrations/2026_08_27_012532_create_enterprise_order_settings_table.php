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
        Schema::create('enterprise_order_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id')->unique()->constrained()->cascadeOnDelete();
            $table->boolean('accepts_pickup')->default(true);
            $table->boolean('accepts_delivery')->default(false);
            $table->decimal('delivery_fee', 12, 2)->default(0);
            $table->decimal('minimum_order_amount', 12, 2)->nullable();
            $table->text('order_instructions')->nullable();
            $table->text('pickup_instructions')->nullable();
            $table->unsignedSmallInteger('estimated_preparation_days')->nullable();
            $table->boolean('accepts_cash_on_pickup')->default(true);
            $table->boolean('accepts_gcash')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enterprise_order_settings');
    }
};
