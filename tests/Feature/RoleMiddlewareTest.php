<?php

use App\Models\Enterprise;
use App\Models\Role;
use App\Models\User;

function userWithRole(string $role): User
{
    return User::factory()->for(Role::factory()->create(['name' => $role]))->create();
}

test('administrator and tourism staff can access the management dashboard', function (string $role) {
    $user = userWithRole($role);

    $this->actingAs($user)->get(route('dashboard'))->assertSuccessful();
    $this->actingAs($user)->get(route('admin.destinations.index'))->assertSuccessful();
})->with(['Administrator', 'Tourism Staff']);

test('tourism enterprise users cannot access the management dashboard', function () {
    $user = userWithRole('Tourism Enterprise');

    $this->actingAs($user)->get(route('dashboard'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.destinations.index'))->assertForbidden();
});

test('tourism enterprise dashboard is exclusive to tourism enterprise users', function () {
    $enterpriseUser = userWithRole('Tourism Enterprise');
    Enterprise::factory()->for($enterpriseUser)->create();

    $this->actingAs($enterpriseUser)->get(route('partner.dashboard'))->assertSuccessful();
    $this->actingAs(userWithRole('Administrator'))->get(route('partner.dashboard'))->assertForbidden();
    $this->actingAs(userWithRole('Tourism Staff'))->get(route('partner.dashboard'))->assertForbidden();
});

test('users without an assigned role cannot access protected dashboards', function () {
    $user = User::factory()->create(['role_id' => null]);

    $this->actingAs($user)->get(route('dashboard'))->assertForbidden();
    $this->actingAs($user)->get(route('partner.dashboard'))->assertForbidden();
});
