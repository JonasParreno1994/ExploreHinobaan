<?php

namespace Database\Factories;

use App\Models\TouristVerification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TouristVerification>
 */
class TouristVerificationFactory extends Factory
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
            'id_type' => 'National ID',
            'id_front_path' => 'tourist-verifications/front.jpg',
            'selfie_with_id_path' => 'tourist-verifications/selfie.jpg',
            'verification_status' => 'pending',
            'submitted_at' => now(),
        ];
    }
}
