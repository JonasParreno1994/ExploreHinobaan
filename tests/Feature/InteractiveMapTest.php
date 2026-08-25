<?php

use App\Models\Barangay;
use App\Models\Destination;
use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\TourismCategory;
use Inertia\Testing\AssertableInertia as Assert;

test('interactive map displays published destinations and approved enterprises with coordinates', function () {
    $barangay = Barangay::factory()->create(['name' => 'Bacuyangan']);
    $category = TourismCategory::factory()->create(['name' => 'Beaches']);
    $enterpriseType = EnterpriseType::factory()->create(['name' => 'Resort']);
    $destination = Destination::factory()->recycle([$barangay, $category])->create([
        'name' => 'Pasil Beach',
        'status' => 'published',
        'contact_number' => '09123456789',
        'latitude' => 9.5,
        'longitude' => 122.6,
    ]);
    $enterprise = Enterprise::factory()->recycle([$barangay, $enterpriseType])->create([
        'business_name' => 'Hinoba-an Beach Resort',
        'application_status' => 'approved',
        'phone' => '09987654321',
        'latitude' => 9.51,
        'longitude' => 122.61,
    ]);

    $this->get(route('interactive-map'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('interactive-map')
        ->has('places', 2)
        ->where('places.0.id', "destination-{$destination->id}")
        ->where('places.0.category', 'Beaches')
        ->where('places.0.phone', '09123456789')
        ->where('places.0.details_url', route('destinations.show', $destination->slug))
        ->where('places.1.id', "enterprise-{$enterprise->id}")
        ->where('places.1.phone', '09987654321')
        ->where('places.1.category', 'Resort'));
});

test('interactive map excludes unpublished unapproved and unmapped records', function () {
    Destination::factory()->create(['status' => 'draft', 'latitude' => 9.5, 'longitude' => 122.6]);
    Destination::factory()->create(['status' => 'published', 'latitude' => null, 'longitude' => null]);
    Enterprise::factory()->create(['application_status' => 'pending', 'latitude' => 9.5, 'longitude' => 122.6]);

    $this->get(route('interactive-map'))->assertInertia(fn (Assert $page) => $page
        ->component('interactive-map')
        ->has('places', 0));
});
