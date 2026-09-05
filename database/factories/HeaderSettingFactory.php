<?php

namespace Database\Factories;

use App\Models\HeaderSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HeaderSetting>
 */
class HeaderSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Main Tourism Header',
            'site_name' => 'Explore Hinoba-an',
            'tagline' => 'Tourism Portal',
            'login_label' => 'Login',
            'register_label' => 'Be a Partner',
            'status' => 'active',
        ];
    }
}
