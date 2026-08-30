<?php

namespace Database\Factories;

use App\Models\BannerText;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BannerText>
 */
class BannerTextFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'header_1' => fake()->words(3, true),
            'header_2' => fake()->sentence(5),
            'header_3' => fake()->paragraph(),
        ];
    }
}
