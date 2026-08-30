<?php

namespace Database\Factories;

use App\Models\WhyVisitSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WhyVisitSection>
 */
class WhyVisitSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'eyebrow' => 'More Than a Destination',
            'title' => 'Why Visit Hinoba-an?',
            'subtitle' => 'Nature, culture, adventure, and room to breathe—all in one welcoming municipality.',
            'cards' => [
                ['title' => 'Natural Wonders', 'description' => 'Discover pristine beaches, caves, forests, mountains, and waterfalls.', 'icon' => 'trees'],
                ['title' => 'Local Culture', 'description' => 'Experience local traditions, festivals, cuisine, and heartfelt hospitality.', 'icon' => 'sparkles'],
                ['title' => 'Adventure', 'description' => 'Enjoy swimming, hiking, island exploration, snorkeling, and outdoor activities.', 'icon' => 'compass'],
                ['title' => 'Peaceful Escape', 'description' => 'Slow down in relaxing destinations away from crowded tourist areas.', 'icon' => 'umbrella'],
            ],
            'status' => 'active',
        ];
    }
}
