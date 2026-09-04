<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from role management to login', function () {
    $this->get('/admin/roles')->assertRedirect('/login');
});

test('authenticated users can view roles', function () {
    $user = User::factory()->create();
    $role = Role::factory()->create(['name' => 'Tourism Officer']);

    $this->actingAs($user)
        ->get('/admin/roles')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/roles/index')
            ->where('roles.data', fn (Collection $roles): bool => $roles->contains(
                fn (array $listedRole): bool => $listedRole['id'] === $role->id && $listedRole['name'] === 'Tourism Officer',
            )));
});

test('authenticated users can add a role', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/admin/roles', [
            'name' => 'Content Manager',
            'description' => 'Manages tourism content and announcements.',
        ])
        ->assertRedirect(route('admin.roles.index'));

    $role = Role::where('name', 'Content Manager')->firstOrFail();

    expect($role->description)->toBe('Manages tourism content and announcements.');
});

test('role names must be unique', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->post('/admin/roles', ['name' => 'Administrator'])
        ->assertSessionHasErrors('name');
});

test('authenticated users can delete a role', function () {
    $user = User::factory()->create();
    $role = Role::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.roles.destroy', $role))
        ->assertRedirect(route('admin.roles.index'));

    $this->assertModelMissing($role);
});
