<?php

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('only approved enterprises appear in the public directory', function () {
    $approved = Enterprise::factory()->create(['application_status' => 'approved', 'approved_at' => now()]);
    Enterprise::factory()->create(['application_status' => 'pending']);

    $this->get(route('enterprises.index'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('enterprises/index')->has('enterprises.data', 1)->where('enterprises.data.0.id', $approved->id));
});

test('approved enterprise exposes only published services', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    EnterpriseService::factory()->for($enterprise)->create(['status' => 'published']);
    EnterpriseService::factory()->for($enterprise)->create(['status' => 'draft']);

    $this->get(route('enterprises.show', $enterprise->slug))->assertOk()->assertInertia(fn (Assert $page) => $page->has('enterprise.services', 1));
});

test('pending enterprise is not publicly accessible', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'pending']);

    $this->get(route('enterprises.show', $enterprise->slug))->assertNotFound();
});

test('published enterprise service page uses scoped route binding', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create(['status' => 'published']);

    $this->get(route('enterprises.services.show', [$enterprise->slug, $service->slug]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('enterprises/services/show')
            ->where('service.id', $service->id));
});
