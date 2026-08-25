<?php

namespace Database\Factories;

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<EnterpriseService>
 */
class EnterpriseServiceFactory extends Factory
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
            'service_type_id' => ServiceType::factory(),
            'name' => $name = fake()->unique()->words(3, true),
            'slug' => Str::slug($name),
            'short_description' => fake()->sentence(),
            'description' => fake()->paragraphs(2, true),
            'price' => fake()->randomFloat(2, 100, 5000),
            'pricing_unit' => fake()->randomElement(['per_night', 'per_day', 'per_person', 'per_service']),
            'capacity' => fake()->numberBetween(1, 20),
            'quantity' => fake()->numberBetween(1, 10),
            'amenities' => ['Wi-Fi', 'Parking'],
            'reservation_required' => true,
            'status' => 'published',
        ];
    }
}
