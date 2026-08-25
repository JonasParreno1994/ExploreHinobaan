<?php

namespace Database\Factories;

use App\Models\Barangay;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Barangay>
 */
class BarangayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'psgc_code' => fake()->unique()->numerify('1804512###'),
            'name' => fake()->unique()->city(),
            'classification' => fake()->randomElement(['urban', 'rural']),
            'population' => fake()->numberBetween(1000, 10000),
            'status' => 'active',
        ];
    }
}
