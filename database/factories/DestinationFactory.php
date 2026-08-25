<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\Destination;
use App\Models\TourismCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Destination>
 */
class DestinationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => TourismCategory::factory(),
            'barangay_id' => Barangay::factory(),
            'name' => fake()->unique()->company().' Attraction',
            'short_description' => fake()->sentence(),
            'description' => fake()->paragraphs(2, true),
            'address' => fake()->streetAddress().', Hinoba-an, Negros Occidental',
            'latitude' => null,
            'longitude' => null,
            'entrance_fee' => fake()->optional()->randomFloat(2, 0, 1000),
            'opening_time' => '08:00',
            'closing_time' => '17:00',
            'contact_number' => fake()->optional()->phoneNumber(),
            'email' => fake()->optional()->safeEmail(),
            'website' => null,
            'featured_image' => null,
            'status' => 'draft',
            'is_featured' => false,
            'views' => 0,
            'created_by' => null,
        ];
    }
}
