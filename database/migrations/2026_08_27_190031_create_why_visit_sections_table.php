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
        Schema::create('why_visit_sections', function (Blueprint $table) {
            $table->id();
            $table->string('eyebrow')->default('More Than a Destination');
            $table->string('title')->default('Why Visit Hinoba-an?');
            $table->text('subtitle')->nullable();
            $table->json('cards');
            $table->string('status')->default('active')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('why_visit_sections');
    }
};
