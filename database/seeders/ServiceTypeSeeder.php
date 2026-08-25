<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Room', 'Cottage', 'Function Hall', 'Pool Access', 'Tour', 'Activity', 'Equipment Rental', 'Food Package', 'Event Package', 'Transportation', 'Other'] as $name) {
            ServiceType::query()->updateOrCreate(['slug' => Str::slug($name)], ['name' => $name, 'status' => 'active']);
        }
    }
}
