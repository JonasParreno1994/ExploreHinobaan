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
        Schema::create('enterprise_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_type_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->string('pricing_unit')->default('per_service');
            $table->unsignedInteger('capacity')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->json('amenities')->nullable();
            $table->string('main_image')->nullable();
            $table->boolean('reservation_required')->default(true);
            $table->time('check_in_time')->nullable();
            $table->time('check_out_time')->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamps();
            $table->unique(['enterprise_id', 'slug']);
            $table->index(['enterprise_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enterprise_services');
    }
};
