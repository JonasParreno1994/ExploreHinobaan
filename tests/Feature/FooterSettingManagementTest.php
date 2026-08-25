<?php

use App\Models\FooterSetting;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function validFooterSettingData(array $overrides = []): array
{
    return [
        'name' => 'Main Tourism Footer',
        'description' => 'Official tourism information for visitors.',
        'municipality' => 'Municipality of Hinoba-an',
        'office' => 'Municipal Tourism Office',
        'address' => 'Hinoba-an, Negros Occidental, Philippines',
        'email' => 'tourism@hinobaan.gov.ph',
        'phone' => '+63 900 000 0000',
        'facebook_url' => 'https://facebook.com/explorehinobaan',
        'instagram_url' => null,
        'youtube_url' => null,
        'copyright_text' => '© 2026 Explore Hinoba-an. All Rights Reserved.',
        'status' => 'active',
        ...$overrides,
    ];
}

function administrator(): User
{
    return User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
}

test('guests cannot access footer management', function () {
    $this->get(route('admin.footer-settings.index'))->assertRedirect(route('login'));
});

test('non administrators cannot access footer management', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Tourism Staff']))->create();

    $this->actingAs($user)->get(route('admin.footer-settings.index'))->assertForbidden();
    $this->actingAs($user)->post(route('admin.footer-settings.store'), validFooterSettingData())->assertForbidden();
});

test('administrators can create view update and delete footer configurations', function () {
    $admin = administrator();

    $this->actingAs($admin)->post(route('admin.footer-settings.store'), validFooterSettingData())
        ->assertRedirect(route('admin.footer-settings.index'));

    $footerSetting = FooterSetting::firstOrFail();
    $this->assertModelExists($footerSetting);

    $this->get(route('admin.footer-settings.show', $footerSetting))
        ->assertInertia(fn (Assert $page) => $page->component('admin/footer-settings/show')->where('footerSetting.name', 'Main Tourism Footer'));

    $this->put(route('admin.footer-settings.update', $footerSetting), validFooterSettingData(['name' => 'Updated Footer']))
        ->assertRedirect(route('admin.footer-settings.index'));
    expect($footerSetting->refresh()->name)->toBe('Updated Footer');

    $this->delete(route('admin.footer-settings.destroy', $footerSetting))->assertRedirect(route('admin.footer-settings.index'));
    $this->assertModelMissing($footerSetting);
});

test('the newest active footer configuration is displayed on the landing page', function () {
    FooterSetting::factory()->create(['description' => 'Inactive footer', 'status' => 'inactive']);
    $activeFooter = FooterSetting::factory()->create(['description' => 'Public tourism footer', 'status' => 'active']);

    $this->get(route('home'))->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->where('footerSetting.id', $activeFooter->id)
        ->where('footerSetting.description', 'Public tourism footer'));
});

test('footer configuration validates contact and social fields', function () {
    $this->actingAs(administrator())->post(route('admin.footer-settings.store'), validFooterSettingData([
        'email' => 'invalid-email',
        'facebook_url' => 'not-a-url',
    ]))->assertInvalid(['email', 'facebook_url']);
});
