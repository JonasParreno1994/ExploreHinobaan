<?php

namespace Database\Seeders;

use App\Models\WhyVisitSection;
use Illuminate\Database\Seeder;

class WhyVisitSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WhyVisitSection::query()->firstOrCreate([], WhyVisitSection::factory()->make()->toArray());
    }
}
