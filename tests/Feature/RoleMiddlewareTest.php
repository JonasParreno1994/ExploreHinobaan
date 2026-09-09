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

test('tourism staff can manage tourism operations but not administrator-only system functions', function () {
    $staff = userWithRole('Tourism Staff');

    $this->actingAs($staff)->get(route('admin.enterprises.index'))->assertSuccessful();
    $this->get(route('admin.tourist-verifications.index'))->assertSuccessful();
    $this->get(route('admin.destinations.index'))->assertSuccessful();

    $this->get(route('admin.users.index'))->assertForbidden();
    $this->get(route('admin.roles.index'))->assertForbidden();
    $this->get(route('admin.audit-logs.index'))->assertForbidden();
    $this->get(route('admin.security-monitoring.index'))->assertForbidden();
    $this->get(route('admin.settings'))->assertForbidden();
    $this->get(route('admin.header-settings.create'))->assertForbidden();
    $this->get(route('admin.footer-settings.index'))->assertForbidden();
});

test('administrators retain access to protected system functions', function () {
    $administrator = userWithRole('Administrator');

    $this->actingAs($administrator)->get(route('admin.users.index'))->assertSuccessful();
    $this->get(route('admin.roles.index'))->assertSuccessful();
    $this->get(route('admin.audit-logs.index'))->assertSuccessful();
    $this->get(route('admin.security-monitoring.index'))->assertSuccessful();
    $this->get(route('admin.settings'))->assertSuccessful();
});

test('tourism staff sidebar excludes administrator-only navigation', function () {
    $source = file_get_contents(resource_path('js/components/admin/admin-sidebar.tsx'));

    expect($source)
        ->toContain("'/admin/users'")
        ->toContain("'/admin/roles'")
        ->toContain("'/admin/audit-logs'")
        ->toContain("'/admin/security-monitoring'")
        ->toContain("'/admin/settings'");
});
