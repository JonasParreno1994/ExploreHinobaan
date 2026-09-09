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
        Schema::create('enterprise_websites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('template')->default('tropical');
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('tagline')->nullable();
            $table->string('primary_color', 7)->default('#0F766E');
            $table->string('secondary_color', 7)->default('#F97316');
            $table->string('accent_color', 7)->default('#FBBF24');
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('social_image')->nullable();
            $table->boolean('is_published')->default(false)->index();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enterprise_websites');
    }
};
