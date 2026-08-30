<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Food & Delicacies', 'Handicrafts', 'Agricultural Products', 'Seafood Products', 'Beverages', 'Souvenirs', 'Clothing & Accessories', 'Natural Products', 'Other'] as $name) {
            ProductCategory::query()->updateOrCreate(['slug' => Str::slug($name)], ['name' => $name, 'status' => 'active']);
        }
    }
}
