<?php

use App\Models\Barangay;
use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\TourismCategory;
use Inertia\Testing\AssertableInertia as Assert;

test('a published destination is available publicly by slug with its admin managed data', function () {
    $barangay = Barangay::factory()->create(['name' => 'Bacuyangan']);
    $category = TourismCategory::factory()->create(['name' => 'Nature']);
    $destination = Destination::factory()->recycle([$barangay, $category])->create([
        'name' => 'Ubong Cave',
        'description' => "First paragraph.\n\nSecond paragraph.",
        'address' => 'Barangay Bacuyangan, Hinoba-an',
        'entrance_fee' => 50,
        'opening_time' => '06:00',
        'closing_time' => '18:00',
        'latitude' => 9.5000000,
        'longitude' => 122.6000000,
        'contact_number' => '09123456789',
        'email' => 'tourism@example.com',
        'website' => 'https://example.com',
        'status' => 'published',
    ]);
    $image = DestinationImage::factory()->for($destination)->create(['caption' => 'Inside Ubong Cave']);

    $this->get(route('destinations.show', $destination->slug))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('destinations/show')
            ->where('destination.id', $destination->id)
            ->where('destination.name', 'Ubong Cave')
            ->where('destination.barangay.name', 'Bacuyangan')
            ->where('destination.category.name', 'Nature')
            ->where('destination.entrance_fee', '50.00')
            ->where('destination.images.0.id', $image->id));

    expect($destination->refresh()->views)->toBe(1);
});

test('draft and archived destinations are not publicly accessible', function (string $status) {
    $destination = Destination::factory()->create(['status' => $status]);

    $this->get(route('destinations.show', $destination->slug))->assertNotFound();
})->with(['draft', 'archived']);

test('related destinations prioritize the same category and exclude unpublished records', function () {
    $category = TourismCategory::factory()->create();
    $barangay = Barangay::factory()->create();
    $destination = Destination::factory()->recycle([$category, $barangay])->create(['status' => 'published']);
    $sameCategory = Destination::factory()->recycle($category)->create(['name' => 'Same Category', 'status' => 'published']);
    Destination::factory()->recycle($category)->create(['name' => 'Hidden Draft', 'status' => 'draft']);

    $this->get(route('destinations.show', $destination->slug))->assertInertia(fn (Assert $page) => $page
        ->where('relatedDestinations.0.id', $sameCategory->id)
        ->missing('relatedDestinations.1'));
});

test('landing page destination data includes the slug used by public details links', function () {
    $destination = Destination::factory()->create(['name' => 'Pasil Beach', 'status' => 'published', 'is_featured' => true]);

    $this->get(route('home'))->assertInertia(fn (Assert $page) => $page
        ->where('destinations.0.id', $destination->id)
        ->where('destinations.0.slug', $destination->slug));
});
