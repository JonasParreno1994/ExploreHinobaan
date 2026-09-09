<?php

namespace Database\Factories;

use App\Models\Enterprise;
use App\Models\EnterpriseSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseSection>
 */
class EnterpriseSectionFactory extends Factory
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
            'section_type' => 'about',
            'title' => 'About Us',
            'subtitle' => fake()->sentence(),
            'content' => fake()->paragraphs(2, true),
            'is_visible' => true,
            'sort_order' => 20,
        ];
    }
}
