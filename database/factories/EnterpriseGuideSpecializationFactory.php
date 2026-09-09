<?php

namespace Database\Factories;

use App\Models\Enterprise;
use App\Models\EnterpriseGuideSpecialization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseGuideSpecialization>
 */
class EnterpriseGuideSpecializationFactory extends Factory
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
            'years_experience' => fake()->numberBetween(1, 20),
            'is_active' => true,
        ];
    }
}
