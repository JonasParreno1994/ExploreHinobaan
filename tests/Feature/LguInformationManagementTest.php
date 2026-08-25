<?php

use App\Models\LguInformation;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function fakeLguImage(string $name): UploadedFile
{
    $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', true);

    return UploadedFile::fake()->createWithContent($name, $png);
}

test('guests cannot access LGU information management', function () {
    $this->get('/admin/lgu-information')->assertRedirect('/login');
});

test('authenticated users can create LGU information with at least five images', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $images = collect(range(1, 5))->map(fn (int $number) => fakeLguImage("lgu-{$number}.png"))->all();

    $this->actingAs($user)->post('/admin/lgu-information', [
        'history' => 'Municipal history', 'mission' => 'Municipal mission', 'vision' => 'Municipal vision',
        'area' => 421.50, 'number_of_barangays' => 13, 'location' => 'Hinoba-an, Negros Occidental', 'images' => $images,
    ])->assertRedirect(route('admin.lgu-information.index'));

    $entry = LguInformation::firstOrFail();
    expect($entry->images)->toHaveCount(5)->and($entry->number_of_barangays)->toBe(13);
    Storage::disk('public')->assertExists($entry->images);
});

test('creation requires at least five valid images', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)->post('/admin/lgu-information', [
        'history' => 'History', 'mission' => 'Mission', 'vision' => 'Vision', 'area' => 10,
        'number_of_barangays' => 13, 'location' => 'Hinoba-an',
        'images' => [fakeLguImage('one.png')],
    ])->assertSessionHasErrors('images');
});

test('authenticated users can view and update LGU information while retaining images', function () {
    $user = User::factory()->create();
    $entry = LguInformation::factory()->create();

    $this->actingAs($user)->get(route('admin.lgu-information.show', $entry))
        ->assertInertia(fn (Assert $page) => $page->component('admin/lgu-information/show')->where('entry.id', $entry->id));

    $this->put(route('admin.lgu-information.update', $entry), [
        'history' => 'Updated history', 'mission' => $entry->mission, 'vision' => $entry->vision,
        'area' => $entry->area, 'number_of_barangays' => 13, 'location' => $entry->location,
    ])->assertRedirect(route('admin.lgu-information.index'));

    expect($entry->refresh()->history)->toBe('Updated history')->and($entry->images)->toHaveCount(5);
});
