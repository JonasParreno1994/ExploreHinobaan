<?php

namespace Database\Factories;

use App\Models\Destination;
use App\Models\DestinationImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DestinationImage>
 */
class DestinationImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'destination_id' => Destination::factory(),
            'image_path' => 'destinations/gallery/sample.jpg',
            'caption' => fake()->optional()->sentence(),
            'sort_order' => 0,
            'is_primary' => false,
        ];
    }
}
