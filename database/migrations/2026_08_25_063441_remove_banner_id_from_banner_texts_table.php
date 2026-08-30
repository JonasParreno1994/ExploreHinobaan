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
        Schema::table('banner_texts', function (Blueprint $table) {
            $table->dropUnique(['banner_id']);
            $table->dropConstrainedForeignId('banner_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banner_texts', function (Blueprint $table) {
            $table->foreignId('banner_id')->nullable()->unique()->constrained()->cascadeOnDelete();
        });
    }
};
