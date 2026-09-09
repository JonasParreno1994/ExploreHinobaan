<?php

namespace Database\Factories;

use App\Models\EnterpriseTourItinerary;
use App\Models\EnterpriseTourPackage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseTourItinerary>
 */
class EnterpriseTourItineraryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'enterprise_tour_package_id' => EnterpriseTourPackage::factory(),
            'time' => '08:00',
            'activity' => fake()->words(3, true),
            'destination' => fake()->city(),
            'description' => fake()->sentence(),
            'sort_order' => 0,
        ];
    }
}
