<?php

namespace Database\Factories;

use App\Models\Enterprise;
use App\Models\EnterpriseWebsiteEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseWebsiteEvent>
 */
class EnterpriseWebsiteEventFactory extends Factory
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
            'event_type' => fake()->randomElement(['profile_view', 'direction_click', 'contact_click']),
            'visitor_hash' => hash('sha256', fake()->uuid()),
            'target_type' => null,
            'target_id' => null,
            'target_label' => null,
            'metadata' => null,
        ];
    }
}
