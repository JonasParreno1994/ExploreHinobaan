<?php

use App\Models\Barangay;
use App\Models\Destination;
use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\TourismCategory;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
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

test('directions endpoint returns a road route with instructions', function () {
    config()->set('services.openrouteservice.key', 'test-routing-key');
    Http::preventStrayRequests();
    Http::fake([
        'api.openrouteservice.org/*' => Http::response([
            'features' => [[
                'geometry' => [
                    'coordinates' => [
                        [122.47, 9.58],
                        [122.5, 9.61],
                    ],
                ],
                'properties' => [
                    'summary' => ['distance' => 5200.5, 'duration' => 780.0],
                    'segments' => [[
                        'steps' => [[
                            'instruction' => 'Head south',
                            'distance' => 350.0,
                            'duration' => 45.0,
                        ]],
                    ]],
                ],
            ]],
        ]),
    ]);

    $this->getJson(route('directions.route', [
        'origin_latitude' => 9.58,
        'origin_longitude' => 122.47,
        'destination_latitude' => 9.61,
        'destination_longitude' => 122.5,
        'travel_mode' => 'driving-car',
    ]))->assertSuccessful()
        ->assertJsonPath('positions.0', [9.58, 122.47])
        ->assertJsonPath('positions.1', [9.61, 122.5])
        ->assertJsonPath('distance', 5200.5)
        ->assertJsonPath('duration', 780)
        ->assertJsonPath('steps.0.instruction', 'Head south');

    Http::assertSent(fn (Request $request): bool => $request->hasHeader('Authorization', 'Bearer test-routing-key')
        && $request->hasHeader('Accept', 'application/geo+json')
        && $request['coordinates'] === [[122.47, 9.58], [122.5, 9.61]]
        && $request['radiuses'] === [5000, 5000]);
});

test('directions endpoint validates coordinates and travel mode', function () {
    config()->set('services.openrouteservice.key', 'test-routing-key');
    Http::preventStrayRequests();

    $this->getJson(route('directions.route', [
        'origin_latitude' => 95,
        'origin_longitude' => 122.47,
        'destination_latitude' => 9.61,
        'destination_longitude' => 122.5,
        'travel_mode' => 'flying',
    ]))->assertUnprocessable()
        ->assertInvalid(['origin_latitude', 'travel_mode']);

    Http::assertNothingSent();
});

test('directions endpoint gracefully reports missing routing configuration', function () {
    config()->set('services.openrouteservice.key');
    Http::preventStrayRequests();

    $this->getJson(route('directions.route', [
        'origin_latitude' => 9.58,
        'origin_longitude' => 122.47,
        'destination_latitude' => 9.61,
        'destination_longitude' => 122.5,
        'travel_mode' => 'foot-walking',
    ]))->assertServiceUnavailable()
        ->assertJsonPath('message', 'In-app directions are not configured yet.');

    Http::assertNothingSent();
});

test('interactive map opens directions inside the application with a Google Maps fallback', function () {
    $mapPage = file_get_contents(resource_path('js/pages/interactive-map.tsx'));

    expect($mapPage)
        ->toContain('role="dialog"')
        ->toContain("route('directions.route')")
        ->toContain('routeResult.positions')
        ->toContain('Start in Google Maps')
        ->not->toContain('href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}');
});

test('interactive map controls are positioned below the upper-left zoom control', function () {
    $mapPage = file_get_contents(resource_path('js/pages/interactive-map.tsx'));

    expect($mapPage)
        ->toContain('data-testid="map-controls" className="absolute top-20 left-2.5')
        ->toContain("aria-label={locating ? 'Locating your position' : 'Show my location'}")
        ->not->toContain('data-testid="map-controls" className="absolute top-4 right-4')
        ->not->toContain("{locating ? 'Locating...' : 'My Location'}")
        ->not->toContain('mapped place{filteredPlaces.length === 1');
});
