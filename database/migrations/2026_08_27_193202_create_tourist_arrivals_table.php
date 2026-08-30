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
        Schema::create('tourist_arrivals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reservation_id')->nullable()->constrained()->nullOnDelete()->unique();
            $table->foreignId('enterprise_service_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->date('arrival_date')->index();
            $table->date('check_in_date')->nullable();
            $table->date('check_out_date')->nullable();
            $table->string('booking_source', 30)->index();
            $table->string('visitor_type', 20)->index();
            $table->string('country')->default('Philippines');
            $table->string('province')->nullable()->index();
            $table->string('city_municipality')->nullable()->index();
            $table->unsignedInteger('adults')->default(0);
            $table->unsignedInteger('children')->default(0);
            $table->unsignedInteger('total_guests');
            $table->string('visit_type', 30)->index();
            $table->string('arrival_type', 40)->index();
            $table->string('purpose_of_visit')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['enterprise_id', 'arrival_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tourist_arrivals');
    }
};
