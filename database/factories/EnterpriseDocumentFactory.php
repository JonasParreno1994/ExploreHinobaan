<?php

namespace Database\Factories;

use App\Models\Enterprise;
use App\Models\EnterpriseDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EnterpriseDocument>
 */
class EnterpriseDocumentFactory extends Factory
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
            'document_type' => fake()->randomElement(['Business Permit', 'DTI Registration', 'Mayor Permit', 'Sanitary Permit']),
            'document_number' => fake()->optional()->bothify('DOC-####-????'),
            'file_path' => 'enterprise-documents/'.fake()->uuid().'.pdf',
            'expiration_date' => fake()->optional()->dateTimeBetween('+1 month', '+2 years')?->format('Y-m-d'),
            'verification_status' => 'pending',
            'remarks' => null,
        ];
    }
}
