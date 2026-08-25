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
        Schema::create('banner_texts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('banner_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('header_1')->nullable();
            $table->string('header_2')->nullable();
            $table->text('header_3')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banner_texts');
    }
};
