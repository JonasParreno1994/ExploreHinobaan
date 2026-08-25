<?php

use App\Models\Banner;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function fakeBannerImage(string $name): UploadedFile
{
    return UploadedFile::fake()->createWithContent($name, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', true));
}

function bannerAdministrator(): User
{
    return User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
}

test('guests cannot access banner management', function () {
    $this->get('/admin/banners')->assertRedirect('/login');
});

test('authenticated users can create and view a banner with many pictures and sentences', function () {
    Storage::fake('public');
    $user = bannerAdministrator();
    $images = [fakeBannerImage('one.png'), fakeBannerImage('two.png'), fakeBannerImage('three.png')];

    $this->actingAs($user)->post('/admin/banners', [
        'images' => $images,
        'status' => 'active',
    ])->assertRedirect(route('admin.banners.index'));

    $banner = Banner::firstOrFail();
    expect($banner->images)->toHaveCount(3);
    Storage::disk('public')->assertExists($banner->images);

    $this->get(route('admin.banners.show', $banner))->assertInertia(fn (Assert $page) => $page->component('admin/banners/show')->where('banner.id', $banner->id));
});

test('authenticated users can update a banner and retain pictures', function () {
    $user = bannerAdministrator();
    $banner = Banner::factory()->create();

    $this->actingAs($user)->put(route('admin.banners.update', $banner), [
        'status' => 'inactive',
    ])->assertRedirect(route('admin.banners.index'));

    expect($banner->refresh()->images)->toHaveCount(1)->and($banner->status)->toBe('inactive');
});

test('administrator can update text without uploading banner pictures', function () {
    $banner = Banner::factory()->create();

    $this->actingAs(bannerAdministrator())->put(route('admin.text.update', $banner), [
        'header_1' => 'Southern Negros Occidental',
        'header_2' => 'Discover Hinoba-an',
        'header_3' => 'Explore our beautiful municipality.',
    ])->assertRedirect(route('admin.text.index'));

    expect($banner->textContent()->firstOrFail()->header_2)->toBe('Discover Hinoba-an');
});

test('authenticated users can delete a banner and its pictures', function () {
    Storage::fake('public');
    $user = bannerAdministrator();
    Storage::disk('public')->put('banners/test.png', 'image');
    $banner = Banner::factory()->create(['images' => ['banners/test.png']]);

    $this->actingAs($user)->delete(route('admin.banners.destroy', $banner))->assertRedirect(route('admin.banners.index'));

    $this->assertModelMissing($banner);
    Storage::disk('public')->assertMissing('banners/test.png');
});
