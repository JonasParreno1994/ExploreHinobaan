<?php

use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\User;
use Database\Seeders\EnterpriseTypeSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot access enterprise type management', function () {
    $this->get('/admin/enterprise-types')->assertRedirect('/login');
});

test('authenticated users can list and search enterprise types', function () {
    $user = User::factory()->create();
    $hotel = EnterpriseType::factory()->create(['name' => 'Hotel', 'slug' => 'hotel', 'description' => 'Lodging enterprise']);
    EnterpriseType::factory()->create(['name' => 'Restaurant', 'slug' => 'restaurant']);

    $this->actingAs($user)->get('/admin/enterprise-types?search=Hotel')
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/enterprise-types/index')
            ->has('enterpriseTypes.data', 1)
            ->where('enterpriseTypes.data.0.id', $hotel->id)
            ->where('filters.search', 'Hotel'));
});

test('authenticated users can create an enterprise type with an automatic slug', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/admin/enterprise-types', [
        'name' => 'Dive Operator',
        'description' => 'Provides guided diving experiences.',
        'status' => 'active',
    ])->assertRedirect(route('admin.enterprise-types.index'));

    $enterpriseType = EnterpriseType::firstOrFail();
    expect($enterpriseType->slug)->toBe('dive-operator')
        ->and($enterpriseType->description)->toBe('Provides guided diving experiences.');
});

test('enterprise type names must be unique', function () {
    $user = User::factory()->create();
    EnterpriseType::factory()->create(['name' => 'Resort', 'slug' => 'resort']);

    $this->actingAs($user)->post('/admin/enterprise-types', [
        'name' => 'Resort',
        'description' => '',
        'status' => 'active',
    ])->assertSessionHasErrors('name');
});

test('authenticated users can edit and regenerate an enterprise type slug', function () {
    $user = User::factory()->create();
    $enterpriseType = EnterpriseType::factory()->create(['name' => 'Old Type', 'slug' => 'old-type']);

    $this->actingAs($user)->put(route('admin.enterprise-types.update', $enterpriseType), [
        'name' => 'Updated Type',
        'description' => 'Updated description.',
        'status' => 'inactive',
    ])->assertRedirect(route('admin.enterprise-types.index'));

    expect($enterpriseType->refresh()->slug)->toBe('updated-type')
        ->and($enterpriseType->status)->toBe('inactive');
});

test('enterprise types can be activated and deactivated without deleting linked enterprises', function () {
    $user = User::factory()->create();
    $enterpriseType = EnterpriseType::factory()->create(['status' => 'active']);
    $enterprise = Enterprise::factory()->for($enterpriseType)->create();

    $this->actingAs($user)->patch(route('admin.enterprise-types.deactivate', $enterpriseType))->assertRedirect();
    expect($enterpriseType->refresh()->status)->toBe('inactive');
    $this->assertModelExists($enterprise);

    $this->patch(route('admin.enterprise-types.activate', $enterpriseType))->assertRedirect();
    expect($enterpriseType->refresh()->status)->toBe('active');
});

test('enterprise types have no permanent delete endpoint', function () {
    $user = User::factory()->create();
    $enterpriseType = EnterpriseType::factory()->create();

    $this->actingAs($user)->delete('/admin/enterprise-types/'.$enterpriseType->id)->assertMethodNotAllowed();
    $this->assertModelExists($enterpriseType);
});

test('enterprise type seeder creates the requested active dataset', function () {
    $this->seed(EnterpriseTypeSeeder::class);

    expect(EnterpriseType::query()->orderBy('name')->pluck('name')->all())->toBe([
        'Cafe', 'Homestay', 'Hotel', 'Local Product Seller', 'Recreation Provider', 'Resort', 'Restaurant', 'Tour Guide', 'Tour Operator',
    ]);
    expect(EnterpriseType::query()->where('status', 'active')->count())->toBe(9);
});
