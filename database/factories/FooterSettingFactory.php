<?php

namespace Database\Factories;

use App\Models\FooterSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FooterSetting>
 */
class FooterSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Main Tourism Footer',
            'description' => fake()->sentence(),
            'municipality' => 'Municipality of Hinoba-an',
            'office' => 'Municipal Tourism Office',
            'address' => 'Hinoba-an, Negros Occidental, Philippines',
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'facebook_url' => 'https://facebook.com/explorehinobaan',
            'instagram_url' => 'https://instagram.com/explorehinobaan',
            'youtube_url' => 'https://youtube.com/@explorehinobaan',
            'copyright_text' => '© 2026 Explore Hinoba-an. All Rights Reserved.',
            'status' => 'active',
        ];
    }
}
