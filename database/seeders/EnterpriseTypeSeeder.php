<?php

namespace Database\Seeders;

use App\Models\EnterpriseType;
use Illuminate\Database\Seeder;

class EnterpriseTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Resort', 'Hotel', 'Homestay', 'Restaurant', 'Cafe', 'Tour Operator', 'Tour Guide', 'Recreation Provider', 'Local Product Seller'] as $name) {
            EnterpriseType::query()->updateOrCreate(['name' => $name], ['status' => 'active']);
        }
    }
}
