<?php

namespace Database\Factories;

use App\Models\TourismCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<TourismCategory>
 */
class TourismCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => Str::title($name),
            'description' => fake()->optional()->sentence(),
            'icon' => fake()->randomElement(['Mountain', 'Waves', 'Palmtree', 'Trees']),
            'status' => 'active',
        ];
    }
}
