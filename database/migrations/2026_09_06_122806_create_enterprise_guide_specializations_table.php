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
        Schema::create('enterprise_guide_specializations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('years_experience')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['enterprise_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enterprise_guide_specializations');
    }
};
