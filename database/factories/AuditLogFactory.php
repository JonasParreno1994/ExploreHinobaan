<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'actor_name' => fake()->name(),
            'actor_email' => fake()->safeEmail(),
            'action' => 'created',
            'method' => 'POST',
            'route_name' => 'admin.roles.store',
            'path' => 'admin/roles',
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'metadata' => ['changed_fields' => ['name']],
        ];
    }
}
