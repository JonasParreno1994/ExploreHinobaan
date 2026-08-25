<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);

        return [
            'barangay_id' => fake()->boolean(70) ? Barangay::factory() : null,
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->randomNumber(5),
            'event_type' => fake()->randomElement(['Festival', 'Cultural Event', 'Tourism Event', 'Sports Event', 'Community Event', 'Municipal Event', 'Barangay Event', 'Other']),
            'short_description' => fake()->sentence(),
            'description' => fake()->paragraphs(2, true),
            'venue' => fake()->streetAddress(),
            'start_date' => fake()->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'end_date' => null,
            'start_time' => '08:00',
            'end_time' => '17:00',
            'featured_image' => null,
            'registration_link' => null,
            'organizer' => fake()->company(),
            'contact_number' => fake()->optional()->phoneNumber(),
            'status' => 'draft',
            'is_featured' => false,
            'created_by' => null,
        ];
    }
}
