<?php

namespace Database\Seeders;

use App\Models\TourismCategory;
use Illuminate\Database\Seeder;

class TourismCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Caves', 'icon' => 'Mountain'],
            ['name' => 'Beaches', 'icon' => 'Waves'],
            ['name' => 'Islands', 'icon' => 'Palmtree'],
            ['name' => 'Waterfalls', 'icon' => 'Droplets'],
            ['name' => 'Nature & Eco-Tourism', 'icon' => 'Trees'],
            ['name' => 'Resorts', 'icon' => 'Hotel'],
            ['name' => 'Accommodation', 'icon' => 'Bed'],
            ['name' => 'Food & Dining', 'icon' => 'Utensils'],
            ['name' => 'Activities', 'icon' => 'Activity'],
            ['name' => 'Festivals & Events', 'icon' => 'CalendarDays'],
            ['name' => 'Local Products', 'icon' => 'ShoppingBag'],
        ];

        foreach ($categories as $category) {
            TourismCategory::query()->updateOrCreate(
                ['name' => $category['name']],
                [...$category, 'status' => 'active'],
            );
        }
    }
}
