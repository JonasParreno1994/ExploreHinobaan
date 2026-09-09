<?php

namespace Database\Factories;

use App\Models\Enterprise;
use App\Models\EnterpriseSocialLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseSocialLink>
 */
class EnterpriseSocialLinkFactory extends Factory
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
            'platform' => 'facebook',
            'url' => 'https://facebook.com/'.fake()->userName(),
        ];
    }
}
