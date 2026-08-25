<?php

use App\Models\Barangay;
use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\TourismCategory;
use App\Models\User;
use Database\Seeders\DestinationSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function fakeDestinationImage(string $name): UploadedFile
{
    return UploadedFile::fake()->createWithContent($name, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', true));
}

function validDestinationData(TourismCategory $category, Barangay $barangay): array
{
    return [
        'category_id' => $category->id,
        'barangay_id' => $barangay->id,
        'name' => 'Test Tourism Destination',
        'short_description' => 'A short destination summary.',
        'description' => 'A complete destination description.',
        'address' => 'Barangay Test, Hinoba-an, Negros Occidental',
        'latitude' => '',
        'longitude' => '',
        'entrance_fee' => '100.00',
        'opening_time' => '08:00',
        'closing_time' => '17:00',
        'contact_number' => '09123456789',
        'email' => 'destination@example.com',
        'website' => 'https://example.com',
        'status' => 'draft',
        'is_featured' => false,
    ];
}

test('guests cannot access destination management', function () {
    $this->get('/admin/destinations')->assertRedirect('/login');
});

test('destination seeder creates published featured destinations without invented coordinates', function () {
    $this->seed(DestinationSeeder::class);

    expect(Destination::count())->toBe(3)
        ->and(Destination::where('status', 'published')->count())->toBe(3)
        ->and(Destination::where('is_featured', true)->count())->toBe(3)
        ->and(Destination::whereNotNull('latitude')->count())->toBe(0)
        ->and(Destination::whereNotNull('longitude')->count())->toBe(0);
});

test('authenticated users can create a destination with featured and gallery images in a transaction', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $category = TourismCategory::factory()->create();
    $barangay = Barangay::factory()->create();

    $this->actingAs($user)->post('/admin/destinations', [
        ...validDestinationData($category, $barangay),
        'featured_image' => fakeDestinationImage('featured.png'),
        'gallery_images' => [fakeDestinationImage('one.png'), fakeDestinationImage('two.png')],
    ])->assertRedirect(route('admin.destinations.index'));

    $destination = Destination::with('images')->firstOrFail();
    expect($destination->slug)->toBe('test-tourism-destination')
        ->and($destination->created_by)->toBe($user->id)
        ->and($destination->latitude)->toBeNull()
        ->and($destination->images)->toHaveCount(2);
    Storage::disk('public')->assertExists([$destination->featured_image, ...$destination->images->pluck('image_path')->all()]);
});

test('destinations can be searched and filtered with eager loaded relationships', function () {
    $user = User::factory()->create();
    $category = TourismCategory::factory()->create();
    $barangay = Barangay::factory()->create();
    Destination::factory()->recycle([$category, $barangay])->create(['name' => 'Hidden Falls', 'status' => 'published']);
    Destination::factory()->create(['name' => 'Other Beach', 'status' => 'draft']);

    $this->actingAs($user)->get("/admin/destinations?search=falls&category={$category->id}&barangay={$barangay->id}&status=published")
        ->assertInertia(fn (Assert $page) => $page->component('admin/destinations/index')->has('destinations.data', 1)->where('destinations.data.0.name', 'Hidden Falls'));
});

test('destination publishing archive and featured actions work', function () {
    $user = User::factory()->create();
    $destination = Destination::factory()->create(['status' => 'draft', 'is_featured' => false]);

    $this->actingAs($user)->patch(route('admin.destinations.publish', $destination))->assertRedirect();
    expect($destination->refresh()->status)->toBe('published');

    $this->patch(route('admin.destinations.toggle-featured', $destination))->assertRedirect();
    expect($destination->refresh()->is_featured)->toBeTrue();

    $this->patch(route('admin.destinations.unpublish', $destination))->assertRedirect();
    expect($destination->refresh()->status)->toBe('draft');

    $this->patch(route('admin.destinations.archive', $destination))->assertRedirect();
    expect($destination->refresh()->status)->toBe('archived')->and($destination->is_featured)->toBeFalse();
});

test('gallery images can be reordered and individually deleted only from their destination', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $destination = Destination::factory()->create();
    $images = DestinationImage::factory()->count(3)->for($destination)->sequence(
        ['image_path' => 'destinations/gallery/one.png', 'sort_order' => 0],
        ['image_path' => 'destinations/gallery/two.png', 'sort_order' => 1],
        ['image_path' => 'destinations/gallery/three.png', 'sort_order' => 2],
    )->create();
    $images->each(fn (DestinationImage $image) => Storage::disk('public')->put($image->image_path, 'image'));

    $this->actingAs($user)->put(route('admin.destinations.images.reorder', $destination), [
        'image_ids' => [$images[2]->id, $images[0]->id, $images[1]->id],
    ])->assertRedirect();
    expect($images[2]->refresh()->sort_order)->toBe(0)->and($images[0]->refresh()->sort_order)->toBe(1);

    $this->delete(route('admin.destinations.images.destroy', [$destination, $images[0]]))->assertRedirect();
    $this->assertModelMissing($images[0]);
    Storage::disk('public')->assertMissing('destinations/gallery/one.png');

    $otherDestination = Destination::factory()->create();
    $this->delete(route('admin.destinations.images.destroy', [$otherDestination, $images[1]]))->assertNotFound();
    $this->assertModelExists($images[1]);
});

test('destination image validation rejects unsupported and oversized uploads', function () {
    $user = User::factory()->create();
    $category = TourismCategory::factory()->create();
    $barangay = Barangay::factory()->create();

    $this->actingAs($user)->post('/admin/destinations', [
        ...validDestinationData($category, $barangay),
        'featured_image' => UploadedFile::fake()->create('malware.exe', 10, 'application/octet-stream'),
    ])->assertInvalid('featured_image');
});
