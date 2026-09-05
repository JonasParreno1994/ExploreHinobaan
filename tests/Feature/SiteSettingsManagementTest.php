<?php

use App\Models\FooterSetting;
use App\Models\HeaderSetting;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function siteSettingsAdministrator(): User
{
    return User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
}

function validHeaderSettingData(array $overrides = []): array
{
    return [
        'name' => 'Main Header',
        'site_name' => 'Explore Hinoba-an',
        'tagline' => 'Tourism Portal',
        'login_label' => 'Sign in',
        'register_label' => 'Join now',
        'status' => 'active',
        ...$overrides,
    ];
}

test('guests cannot access the site settings page', function () {
    $this->get(route('admin.settings'))->assertRedirect(route('login'));
});

test('non administrators cannot access site settings', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Tourism Staff']))->create();

    $this->actingAs($user)->get(route('admin.settings'))->assertForbidden();
    $this->post(route('admin.header-settings.store'), validHeaderSettingData())->assertForbidden();
});

test('administrators see header and footer configurations on the settings page', function () {
    $header = HeaderSetting::factory()->create();
    $footer = FooterSetting::factory()->create();

    $this->actingAs(siteSettingsAdministrator())->get(route('admin.settings'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings/index')
            ->where('headerSetting.id', $header->id)
            ->where('footerSetting.id', $footer->id));
});

test('administrators can create and update header settings', function () {
    $this->actingAs(siteSettingsAdministrator())->post(route('admin.header-settings.store'), validHeaderSettingData())
        ->assertRedirect(route('admin.settings'));

    $header = HeaderSetting::firstOrFail();
    expect($header->site_name)->toBe('Explore Hinoba-an');

    $this->put(route('admin.header-settings.update', $header), validHeaderSettingData(['site_name' => 'Visit Hinoba-an']))
        ->assertRedirect(route('admin.settings'));

    expect($header->refresh()->site_name)->toBe('Visit Hinoba-an');
});

test('administrators can update header settings through the multipart browser submission', function () {
    $header = HeaderSetting::factory()->create();

    $this->actingAs(siteSettingsAdministrator())->post(route('admin.header-settings.update', $header), [
        ...validHeaderSettingData(['site_name' => 'Updated Tourism Website']),
        '_method' => 'put',
        'logo' => null,
        'remove_logo' => false,
    ])->assertRedirect(route('admin.settings'))->assertSessionHasNoErrors();

    expect($header->refresh()->site_name)->toBe('Updated Tourism Website');
});

test('the newest active header configuration is displayed on the landing page', function () {
    HeaderSetting::factory()->create(['site_name' => 'Inactive header', 'status' => 'inactive']);
    $activeHeader = HeaderSetting::factory()->create(['site_name' => 'Public tourism header', 'status' => 'active']);

    $this->get(route('home'))->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->where('headerSetting.id', $activeHeader->id)
        ->where('headerSetting.site_name', 'Public tourism header')
        ->where('branding.id', $activeHeader->id)
        ->where('branding.site_name', 'Public tourism header'));
});

test('administrators can upload a header logo', function () {
    Storage::fake('public');

    $this->actingAs(siteSettingsAdministrator())->post(route('admin.header-settings.store'), [
        ...validHeaderSettingData(),
        'logo' => UploadedFile::fake()->createWithContent(
            'tourism-logo.png',
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='),
        ),
    ])->assertRedirect(route('admin.settings'));

    $header = HeaderSetting::firstOrFail();

    expect($header->logo_path)->not->toBeNull();
    Storage::disk('public')->assertExists($header->logo_path);
});

test('the active header logo is used as the browser favicon', function () {
    $header = HeaderSetting::factory()->create([
        'logo_path' => 'header-logos/site-logo.png',
        'status' => 'active',
    ]);

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertSee('id="site-favicon"', false)
        ->assertSee($header->logo_url, false);
});

test('administrators can upload and replace the social media preview image', function () {
    Storage::fake('public');
    $administrator = siteSettingsAdministrator();

    $this->actingAs($administrator)->post(route('admin.header-settings.store'), [
        ...validHeaderSettingData(),
        'social_image' => UploadedFile::fake()->createWithContent(
            'social-preview.png',
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='),
        ),
    ])->assertRedirect(route('admin.settings'))->assertSessionHasNoErrors();

    $header = HeaderSetting::firstOrFail();
    $originalSocialImagePath = $header->social_image_path;

    expect($originalSocialImagePath)->not->toBeNull();
    Storage::disk('public')->assertExists($originalSocialImagePath);

    $this->actingAs($administrator)->post(route('admin.header-settings.update', $header), [
        ...validHeaderSettingData(),
        '_method' => 'put',
        'social_image' => UploadedFile::fake()->createWithContent(
            'updated-social-preview.png',
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='),
        ),
    ])->assertRedirect(route('admin.settings'))->assertSessionHasNoErrors();

    $updatedSocialImagePath = $header->refresh()->social_image_path;

    expect($updatedSocialImagePath)->not->toBe($originalSocialImagePath);
    Storage::disk('public')->assertMissing($originalSocialImagePath);
    Storage::disk('public')->assertExists($updatedSocialImagePath);
});

test('social media preview uploads must be valid images', function () {
    Storage::fake('public');

    $this->actingAs(siteSettingsAdministrator())->post(route('admin.header-settings.store'), [
        ...validHeaderSettingData(),
        'social_image' => UploadedFile::fake()->create('preview.pdf', 100, 'application/pdf'),
    ])->assertSessionHasErrors('social_image');

    expect(HeaderSetting::query()->exists())->toBeFalse();
});

test('the active header social image is rendered in share metadata', function () {
    $header = HeaderSetting::factory()->create([
        'site_name' => 'Visit Hinoba-an',
        'tagline' => 'Discover the southern jewel of Negros Occidental.',
        'social_image_path' => 'social-previews/hinobaan.jpg',
        'status' => 'active',
    ]);

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertSee('property="og:title" content="Visit Hinoba-an"', false)
        ->assertSee('property="og:description" content="Discover the southern jewel of Negros Occidental."', false)
        ->assertSee('property="og:image" content="'.url($header->social_image_url).'"', false)
        ->assertSee('name="twitter:card" content="summary_large_image"', false)
        ->assertSee('name="twitter:image" content="'.url($header->social_image_url).'"', false);
});
