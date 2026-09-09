<?php

namespace Database\Factories;

use App\Models\EnterpriseMenuCategory;
use App\Models\EnterpriseMenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseMenuItem>
 */
class EnterpriseMenuItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'enterprise_id' => fn (array $attributes) => EnterpriseMenuCategory::find($attributes['enterprise_menu_category_id'])?->enterprise_id,
            'enterprise_menu_category_id' => EnterpriseMenuCategory::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 50, 1000),
            'is_available' => true,
        ];
    }
}
