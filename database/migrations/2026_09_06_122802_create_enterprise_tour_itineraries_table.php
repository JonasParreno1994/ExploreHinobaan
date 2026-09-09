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
        Schema::create('enterprise_tour_itineraries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_tour_package_id')->constrained()->cascadeOnDelete();
            $table->time('time')->nullable();
            $table->string('activity');
            $table->string('destination')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['enterprise_tour_package_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enterprise_tour_itineraries');
    }
};
