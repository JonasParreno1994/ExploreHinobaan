<?php

namespace Database\Factories;

use App\Models\Enterprise;
use App\Models\EnterpriseMenuCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseMenuCategory>
 */
class EnterpriseMenuCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'enterprise_id' => Enterprise::factory(),
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->sentence(),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
