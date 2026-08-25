<?php

use App\Models\Gallery;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function fakeGalleryImage(string $name): UploadedFile
{
    return UploadedFile::fake()->createWithContent($name, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', true));
}

test('guests cannot access gallery management', function () {
    $this->get('/admin/gallery')->assertRedirect('/login');
});

test('authenticated users can add and view multiple gallery pictures', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)->post('/admin/gallery', [
        'images' => [fakeGalleryImage('beach.png'), fakeGalleryImage('festival.png')],
        'status' => 'active',
    ])->assertRedirect(route('admin.gallery.index'));

    $gallery = Gallery::firstOrFail();
    expect($gallery->images)->toHaveCount(2);
    Storage::disk('public')->assertExists($gallery->images);

    $this->get(route('admin.gallery.show', $gallery))->assertInertia(
        fn (Assert $page) => $page->component('admin/gallery/show')->where('gallery.id', $gallery->id),
    );
});

test('authenticated users can update a gallery and retain its pictures', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $gallery = Gallery::factory()->create();

    $this->actingAs($user)->put(route('admin.gallery.update', $gallery), [
        'images' => [fakeGalleryImage('new.png')],
        'status' => 'inactive',
    ])->assertRedirect(route('admin.gallery.index'));

    expect($gallery->refresh()->images)->toHaveCount(2)->and($gallery->status)->toBe('inactive');
});

test('authenticated users can delete a gallery and its pictures', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    Storage::disk('public')->put('gallery/test.png', 'image');
    $gallery = Gallery::factory()->create(['images' => ['gallery/test.png']]);

    $this->actingAs($user)->delete(route('admin.gallery.destroy', $gallery))->assertRedirect(route('admin.gallery.index'));

    $this->assertModelMissing($gallery);
    Storage::disk('public')->assertMissing('gallery/test.png');
});
