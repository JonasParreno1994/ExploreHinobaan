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
        Schema::create('lgu_information', function (Blueprint $table) {
            $table->id();
            $table->longText('history');
            $table->longText('mission');
            $table->longText('vision');
            $table->decimal('area', 12, 2);
            $table->unsignedInteger('number_of_barangays');
            $table->string('location');
            $table->json('images');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lgu_information');
    }
};
