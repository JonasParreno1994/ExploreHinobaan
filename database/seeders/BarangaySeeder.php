<?php

namespace Database\Seeders;

use App\Models\Barangay;
use Illuminate\Database\Seeder;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangays = [
            ['name' => 'Alim', 'psgc_code' => '1804512001', 'classification' => 'rural', 'population' => 5120],
            ['name' => 'Asia', 'psgc_code' => '1804512002', 'classification' => 'urban', 'population' => 9407],
            ['name' => 'Bacuyangan', 'psgc_code' => '1804512003', 'classification' => 'urban', 'population' => 8922],
            ['name' => 'Barangay I', 'psgc_code' => '1804512004', 'classification' => 'rural', 'population' => 3026],
            ['name' => 'Barangay II', 'psgc_code' => '1804512005', 'classification' => 'rural', 'population' => 3195],
            ['name' => 'Bulwangan', 'psgc_code' => '1804512006', 'classification' => 'rural', 'population' => 3847],
            ['name' => 'Culipapa', 'psgc_code' => '1804512007', 'classification' => 'urban', 'population' => 8500],
            ['name' => 'Damutan', 'psgc_code' => '1804512008', 'classification' => 'rural', 'population' => 1824],
            ['name' => 'Daug', 'psgc_code' => '1804512009', 'classification' => 'rural', 'population' => 2030],
            ['name' => 'Po-ok', 'psgc_code' => '1804512010', 'classification' => 'rural', 'population' => 3639],
            ['name' => 'San Rafael', 'psgc_code' => '1804512011', 'classification' => 'rural', 'population' => 5212],
            ['name' => 'Sangke', 'psgc_code' => '1804512012', 'classification' => 'rural', 'population' => 2265],
            ['name' => 'Talacagay', 'psgc_code' => '1804512013', 'classification' => 'urban', 'population' => 7377],
        ];

        foreach ($barangays as $barangay) {
            Barangay::query()->updateOrCreate(
                ['psgc_code' => $barangay['psgc_code']],
                [...$barangay, 'status' => 'active'],
            );
        }
    }
}
