<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\Enterprise;
use App\Models\EnterpriseType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Enterprise>
 */
class EnterpriseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $businessName = fake()->unique()->company();

        return [
            'user_id' => null,
            'enterprise_type_id' => EnterpriseType::factory(),
            'barangay_id' => Barangay::factory(),
            'business_name' => $businessName,
            'slug' => Str::slug($businessName).'-'.fake()->unique()->randomNumber(5),
            'contact_person' => fake()->name(),
            'email' => fake()->unique()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'description' => fake()->paragraph(),
            'address' => fake()->streetAddress().', Hinoba-an, Negros Occidental',
            'latitude' => null,
            'longitude' => null,
            'website' => null,
            'logo' => null,
            'cover_image' => null,
            'license_number' => fake()->optional()->bothify('LIC-####-????'),
            'application_status' => 'pending',
            'approved_at' => null,
            'approved_by' => null,
            'rejection_reason' => null,
        ];
    }
}
