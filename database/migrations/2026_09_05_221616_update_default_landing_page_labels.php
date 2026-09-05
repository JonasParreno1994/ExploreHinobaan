<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('header_settings')
            ->where('register_label', 'Register')
            ->update(['register_label' => 'Be a Partner']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('header_settings')
            ->where('register_label', 'Be a Partner')
            ->update(['register_label' => 'Register']);
    }
};
