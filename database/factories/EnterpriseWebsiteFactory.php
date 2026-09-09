<?php

namespace Database\Factories;

use App\EnterpriseWebsiteTemplate;
use App\Models\Enterprise;
use App\Models\EnterpriseWebsite;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseWebsite>
 */
class EnterpriseWebsiteFactory extends Factory
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
            'template' => EnterpriseWebsiteTemplate::Tropical,
            'tagline' => fake()->sentence(),
            'primary_color' => '#0F766E',
            'secondary_color' => '#F97316',
            'accent_color' => '#FBBF24',
            'is_published' => false,
            'published_at' => null,
        ];
    }
}
