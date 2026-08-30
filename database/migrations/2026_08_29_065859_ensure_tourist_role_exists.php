<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('roles')->updateOrInsert(
            ['name' => 'Tourist'],
            ['description' => 'Registered tourists who manage reservations and identity verification.', 'updated_at' => now(), 'created_at' => now()],
        );
    }

    public function down(): void
    {
        $roleId = DB::table('roles')->where('name', 'Tourist')->value('id');

        if ($roleId && ! DB::table('users')->where('role_id', $roleId)->exists()) {
            DB::table('roles')->where('id', $roleId)->delete();
        }
    }
};
