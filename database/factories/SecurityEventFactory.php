<?php

namespace Database\Factories;

use App\Models\SecurityEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SecurityEvent>
 */
class SecurityEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_type' => 'failed_login',
            'attack_type' => 'credential_attack',
            'severity' => 'medium',
            'risk_score' => 45,
            'decision' => 'rate_limit',
            'result' => 'denied',
            'endpoint' => 'login',
            'method' => 'POST',
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'explanation' => [['feature' => 'event_type', 'contribution' => 35, 'reason' => 'Failed authentication']],
            'detected_at' => now(),
        ];
    }
}
