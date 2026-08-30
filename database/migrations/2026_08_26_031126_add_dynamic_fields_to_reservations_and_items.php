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
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('customer_address')->nullable()->after('customer_contact');
        });

        Schema::table('reservation_items', function (Blueprint $table) {
            $table->foreignId('service_session_id')->nullable()->after('enterprise_service_id')->constrained()->nullOnDelete();
            $table->unsignedInteger('adults')->default(1)->after('number_of_guests');
            $table->unsignedInteger('children')->default(0)->after('adults');
            $table->index(['service_session_id', 'reservation_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservation_items', function (Blueprint $table) {
            $table->dropIndex(['service_session_id', 'reservation_date']);
            $table->dropConstrainedForeignId('service_session_id');
            $table->dropColumn(['adults', 'children']);
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('customer_address');
        });
    }
};
