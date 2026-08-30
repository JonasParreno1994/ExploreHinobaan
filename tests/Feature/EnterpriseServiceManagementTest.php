<?php

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\Role;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('enterprise users can manage only their own services', function () {
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $other = User::factory()->for($role)->create();
    $service = EnterpriseService::factory()->for(Enterprise::factory()->for($owner))->create();

    $this->actingAs($owner)->get(route('partner.services.edit', $service))->assertOk();
    $this->actingAs($other)->get(route('partner.services.edit', $service))->assertForbidden();
});

test('enterprise users can archive their own service', function () {
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $service = EnterpriseService::factory()->for(Enterprise::factory()->for($owner))->create(['status' => 'published']);

    $this->actingAs($owner)->patch(route('partner.services.archive', $service))->assertRedirect();

    expect($service->refresh()->status)->toBe('archived');
});

test('enterprise users can configure private pool reservation sessions', function () {
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $enterprise = Enterprise::factory()->for($owner)->create();
    $poolType = ServiceType::factory()->create(['name' => 'Swimming Pool', 'status' => 'active']);

    $this->actingAs($owner)->post(route('partner.services.store'), [
        'enterprise_id' => $enterprise->id, 'service_type_id' => $poolType->id, 'name' => 'Private Swimming Pool',
        'price' => 3000, 'pricing_unit' => 'per_session', 'capacity' => 25, 'quantity' => 1,
        'reservation_required' => true, 'reservation_mode' => 'session', 'pool_type' => 'private', 'status' => 'published',
        'sessions' => [[
            'name' => 'Morning Session', 'start_time' => '08:00', 'end_time' => '12:00',
            'price' => 3000, 'capacity' => 25, 'is_active' => true,
        ]],
    ])->assertRedirect(route('partner.services.index'));

    $service = EnterpriseService::query()->where('name', 'Private Swimming Pool')->with('sessions')->firstOrFail();
    expect($service->reservation_mode)->toBe('session')
        ->and($service->pool_type)->toBe('private')
        ->and($service->sessions)->toHaveCount(1)
        ->and($service->sessions->first()->price)->toBe('3000.00');
});
