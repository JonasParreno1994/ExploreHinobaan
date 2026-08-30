<?php

namespace Database\Factories;

use App\Models\EnterpriseService;
use App\Models\ServiceSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceSession>
 */
class ServiceSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'enterprise_service_id' => EnterpriseService::factory(),
            'name' => fake()->randomElement(['Morning Session', 'Afternoon Session', 'Evening Session']),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'price' => fake()->randomFloat(2, 500, 5000),
            'capacity' => fake()->numberBetween(10, 50),
            'is_active' => true,
        ];
    }
}
