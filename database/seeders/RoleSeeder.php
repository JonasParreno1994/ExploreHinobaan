<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::query()->updateOrCreate(['name' => 'Administrator'], ['description' => 'Full access to the tourism administration system.']);
        Role::query()->updateOrCreate(['name' => 'Tourism Staff'], ['description' => 'Tourism Office staff member with access to tourism management tools.']);
        Role::query()->updateOrCreate(['name' => 'Tourism Enterprise'], ['description' => 'Owner or authorized representative of a registered tourism enterprise.']);
    }
}
