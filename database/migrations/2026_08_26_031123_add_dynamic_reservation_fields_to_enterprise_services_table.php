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
        Schema::table('enterprise_services', function (Blueprint $table) {
            $table->string('reservation_mode')->nullable()->after('reservation_required');
            $table->string('pool_type')->nullable()->after('reservation_mode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enterprise_services', function (Blueprint $table) {
            $table->dropColumn(['reservation_mode', 'pool_type']);
        });
    }
};
