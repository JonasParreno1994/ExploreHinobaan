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
        Schema::create('enterprise_website_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id')->constrained()->cascadeOnDelete();
            $table->string('event_type', 40)->index();
            $table->string('visitor_hash', 64)->index();
            $table->string('target_type', 40)->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->string('target_label')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['enterprise_id', 'created_at']);
            $table->index(['enterprise_id', 'event_type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enterprise_website_events');
    }
};
