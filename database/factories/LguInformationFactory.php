<?php

namespace Database\Factories;

use App\Models\LguInformation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LguInformation>
 */
class LguInformationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'history' => fake()->paragraphs(3, true),
            'mission' => fake()->paragraph(),
            'vision' => fake()->paragraph(),
            'area' => fake()->randomFloat(2, 10, 1000),
            'number_of_barangays' => 13,
            'location' => 'Hinoba-an, Negros Occidental',
            'images' => ['lgu-information/example-1.jpg', 'lgu-information/example-2.jpg', 'lgu-information/example-3.jpg', 'lgu-information/example-4.jpg', 'lgu-information/example-5.jpg'],
        ];
    }
}
