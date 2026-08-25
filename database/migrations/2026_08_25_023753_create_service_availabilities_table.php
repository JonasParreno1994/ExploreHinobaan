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
        Schema::create('service_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_service_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->unsignedInteger('available_quantity')->nullable();
            $table->string('status')->default('available');
            $table->string('notes')->nullable();
            $table->timestamps();
            $table->unique(['enterprise_service_id', 'date']);
            $table->index(['date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_availabilities');
    }
};
