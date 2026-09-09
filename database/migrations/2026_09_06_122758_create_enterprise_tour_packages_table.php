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
        Schema::create('enterprise_tour_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('rate', 12, 2)->default(0);
            $table->text('inclusions')->nullable();
            $table->text('exclusions')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_available')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->index(['enterprise_id', 'is_available']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enterprise_tour_packages');
    }
};
