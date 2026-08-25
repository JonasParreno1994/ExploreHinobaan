<?php

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\Role;
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
