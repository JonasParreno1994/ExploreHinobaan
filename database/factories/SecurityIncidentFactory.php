<?php

namespace Database\Factories;

use App\Models\SecurityEvent;
use App\Models\SecurityIncident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SecurityIncident>
 */
class SecurityIncidentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'security_event_id' => SecurityEvent::factory(),
            'title' => 'Suspicious authentication activity',
            'description' => 'Rules-based monitoring detected suspicious activity.',
            'severity' => 'high',
            'status' => 'new',
        ];
    }
}
