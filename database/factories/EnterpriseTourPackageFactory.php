<?php

namespace Database\Factories;

use App\Models\Enterprise;
use App\Models\EnterpriseTourPackage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseTourPackage>
 */
class EnterpriseTourPackageFactory extends Factory
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
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'rate' => fake()->randomFloat(2, 500, 10000),
            'is_available' => true,
        ];
    }
}
