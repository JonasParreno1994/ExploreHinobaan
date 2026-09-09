<?php

use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\EnterpriseWebsite;
use App\Models\EnterpriseWebsiteEvent;
use App\Models\Role;
use App\Models\User;
use App\Services\EnterpriseWebsiteModuleRegistry;
use Inertia\Testing\AssertableInertia as Assert;

function finalIntegrationUser(string $roleName): User
{
    $role = Role::query()->firstOrCreate(['name' => $roleName], ['description' => $roleName]);

    return User::factory()->for($role)->create();
}

test('administrator controls the website module matrix for an enterprise type', function () {
    $administrator = finalIntegrationUser('Administrator');
    $type = EnterpriseType::factory()->create(['name' => 'Resort']);

    $this->actingAs($administrator)->put(route('admin.enterprise-types.update', $type), [
        'name' => 'Resort',
        'description' => 'Resort',
        'status' => 'active',
        'website_modules' => ['rooms', 'reservations'],
    ])->assertSessionHasNoErrors();

    $enterprise = Enterprise::factory()->for($type->refresh())->create(['application_status' => 'approved']);
    expect(collect(app(EnterpriseWebsiteModuleRegistry::class)->forEnterprise($enterprise))->pluck('key')->all())
        ->toBe(['reservations', 'rooms']);
});

test('public microsite records views and validated engagement events', function () {
    $type = EnterpriseType::factory()->create(['name' => 'Resort']);
    $enterprise = Enterprise::factory()->for($type)->create(['application_status' => 'approved']);
    EnterpriseWebsite::factory()->for($enterprise)->create(['is_published' => true]);

    $this->withHeader('User-Agent', 'Analytics Test')->get(route('enterprises.show', $enterprise))->assertSuccessful();
    $this->withHeader('User-Agent', 'Analytics Test')->post(route('enterprises.website-events.store', $enterprise), [
        'event_type' => 'direction_click',
        'target_label' => 'Get Directions',
    ])->assertNoContent();

    expect(EnterpriseWebsiteEvent::query()->whereBelongsTo($enterprise)->pluck('event_type')->all())
        ->toContain('profile_view', 'direction_click');
});

test('enterprise analytics are owner scoped and admin analytics are aggregated', function () {
    $partner = finalIntegrationUser('Tourism Enterprise');
    $administrator = finalIntegrationUser('Administrator');
    $type = EnterpriseType::factory()->create(['name' => 'Resort']);
    $enterprise = Enterprise::factory()->for($partner)->for($type)->create(['application_status' => 'approved']);
    EnterpriseWebsite::factory()->for($enterprise)->create();
    EnterpriseWebsiteEvent::factory()->count(2)->for($enterprise)->create(['event_type' => 'profile_view']);

    $this->actingAs($partner)->get(route('partner.websites.analytics', $enterprise))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/websites/analytics')
        ->where('analytics.totals.profile_view', 2));
    $this->actingAs($administrator)->get(route('admin.tourism-analytics.index'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('admin/tourism-analytics/index')
        ->where('analytics.totals.profile_view', 2));
});

test('server html contains enterprise-specific social sharing metadata', function () {
    $type = EnterpriseType::factory()->create(['name' => 'Hotel']);
    $enterprise = Enterprise::factory()->for($type)->create(['application_status' => 'approved']);
    EnterpriseWebsite::factory()->for($enterprise)->create([
        'is_published' => true,
        'social_title' => 'Stay at Seaside Hotel',
        'social_description' => 'A verified Hinoba-an hotel.',
    ]);

    $this->get(route('enterprises.show', $enterprise))
        ->assertSuccessful()
        ->assertSee('Stay at Seaside Hotel', false)
        ->assertSee('A verified Hinoba-an hotel.', false);
});
