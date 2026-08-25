<?php

use App\Models\Banner;
use App\Models\Barangay;
use App\Models\Destination;
use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\Event;
use App\Models\TourismCategory;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('landing page displays published tourism data and actual statistics', function () {
    $barangay = Barangay::factory()->create();
    $category = TourismCategory::factory()->create(['name' => 'Beaches']);
    $accommodationType = EnterpriseType::factory()->create(['name' => 'Resort']);

    Destination::factory()->recycle([$barangay, $category])->create([
        'name' => 'Nabulao Bay',
        'status' => 'published',
        'is_featured' => true,
        'latitude' => 9.5000000,
        'longitude' => 122.6000000,
    ]);
    Destination::factory()->create(['status' => 'draft']);

    $accommodation = Enterprise::factory()->recycle([$barangay, $accommodationType])->create([
        'business_name' => 'Hinoba-an Beach Resort',
        'application_status' => 'approved',
        'approved_at' => now(),
    ]);
    Enterprise::factory()->create(['application_status' => 'pending']);

    Event::factory()->recycle($barangay)->create([
        'title' => 'Hinoba-an Coastal Festival',
        'status' => 'published',
        'start_date' => today()->addWeek(),
    ]);

    $this->get(route('home'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->has('destinations', 1)
        ->where('destinations.0.name', 'Nabulao Bay')
        ->has('accommodations', 1)
        ->where('accommodations.0.name', 'Hinoba-an Beach Resort')
        ->where('accommodations.0.slug', $accommodation->slug)
        ->has('events', 1)
        ->where('events.0.title', 'Hinoba-an Coastal Festival')
        ->where('statistics.destinations', 1)
        ->where('statistics.enterprises', 1)
        ->where('statistics.accommodations', 1)
        ->where('statistics.barangays', 3)
        ->has('mapLocations', 1));
});

test('landing page handles empty tourism content', function () {
    $this->get(route('home'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->has('destinations', 0)
        ->has('accommodations', 0)
        ->has('events', 0)
        ->has('mapLocations', 0));
});

test('landing page carousel uses active admin banner pictures and matching text', function () {
    $activeBanner = Banner::factory()->create([
        'images' => ['banners/first.jpg', 'banners/second.jpg'],
        'status' => 'active',
    ]);
    $activeBanner->textContent()->create([
        'header_1' => 'Header one',
        'header_2' => 'Header two',
        'header_3' => 'Header three',
    ]);
    Banner::factory()->create([
        'images' => ['banners/hidden.jpg'],
        'sentences' => ['Hidden heading'],
        'status' => 'inactive',
    ]);

    $this->get(route('home'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->has('heroSlides', 2)
        ->where('heroSlides.0.image', Storage::disk('public')->url('banners/first.jpg'))
        ->where('heroSlides.0.header_1', 'Header one')
        ->where('heroSlides.0.header_2', 'Header two')
        ->where('heroSlides.0.header_3', 'Header three')
        ->where('heroSlides.1.header_2', 'Header two'));
});
