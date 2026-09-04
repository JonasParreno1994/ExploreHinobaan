<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from user management to login', function () {
    $this->get('/admin/users')->assertRedirect('/login');
});

test('authenticated users can view registered users', function () {
    $admin = User::factory()->create(['name' => 'System Administrator', 'email' => 'admin@example.com']);
    $registeredUser = User::factory()->create([
        'name' => 'Maria Santos',
        'email' => 'maria@example.com',
    ]);

    $this->actingAs($admin)
        ->get('/admin/users')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->has('users.data', 2)
            ->where('users.data.0.id', $registeredUser->id)
            ->where('users.data.0.name', 'Maria Santos')
            ->where('users.data.0.email', 'maria@example.com')
            ->missing('users.data.0.password')
            ->missing('users.data.0.remember_token'));
});

test('users can be searched by name or email', function (string $search) {
    $admin = User::factory()->create(['name' => 'System Administrator', 'email' => 'admin@example.com']);
    User::factory()->create(['name' => 'Ana Villanueva', 'email' => 'ana@example.com']);
    User::factory()->create(['name' => 'Ben Flores', 'email' => 'ben@example.com']);

    $this->actingAs($admin)
        ->get('/admin/users?search='.urlencode($search))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Ana Villanueva'));
})->with([
    'name' => 'Villanueva',
    'email' => 'ana@example.com',
]);

test('authenticated users can create a user with a status', function () {
    $admin = User::factory()->create();
    $role = Role::factory()->create();

    $this->actingAs($admin)->post('/admin/users', [
        'name' => 'New Tourism User',
        'email' => 'new.user@example.com',
        'phone' => '+63 912 345 6789',
        'role_id' => $role->id,
        'status' => 'suspended',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertRedirect(route('admin.users.index'));

    $user = User::where('email', 'new.user@example.com')->firstOrFail();

    expect($user->name)->toBe('New Tourism User')
        ->and($user->status)->toBe('suspended')
        ->and($user->phone)->toBe('+63 912 345 6789')
        ->and($user->role_id)->toBe($role->id)
        ->and(Hash::check('password123', $user->password))->toBeTrue();
});

test('authenticated users can view and update a user', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create(['status' => 'active']);
    $role = Role::factory()->create(['name' => 'Tourism Officer']);

    $this->actingAs($admin)
        ->get(route('admin.users.show', $user))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/show')
            ->where('managedUser.id', $user->id));

    $this->put(route('admin.users.update', $user), [
        'name' => 'Updated User',
        'email' => 'updated@example.com',
        'phone' => '09123456789',
        'role_id' => $role->id,
        'status' => 'inactive',
        'password' => '',
        'password_confirmation' => '',
    ])->assertRedirect(route('admin.users.index'));

    expect($user->refresh()->name)->toBe('Updated User')
        ->and($user->email)->toBe('updated@example.com')
        ->and($user->phone)->toBe('09123456789')
        ->and($user->role_id)->toBe($role->id)
        ->and($user->status)->toBe('inactive');
});

test('authenticated users can delete another user', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user))
        ->assertRedirect(route('admin.users.index'));

    $this->assertModelMissing($user);
});

test('a user cannot delete their own account', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->from(route('admin.users.index'))
        ->delete(route('admin.users.destroy', $admin))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHasErrors('user');

    $this->assertModelExists($admin);
});

test('user status must be an allowed choice', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post('/admin/users', [
            'name' => 'Invalid Status',
            'email' => 'invalid@example.com',
            'status' => 'unknown',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])
        ->assertSessionHasErrors('status');
});

test('create and edit pages provide available roles', function () {
    $admin = User::factory()->create();
    $role = Role::factory()->create(['name' => 'Content Manager']);
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('admin.users.create'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/create')
            ->where('roles', fn (Collection $roles): bool => $roles->contains('id', $role->id)));

    $this->get(route('admin.users.edit', $user))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/edit')
            ->where('roles', fn (Collection $roles): bool => $roles->contains('name', 'Content Manager')));
});

test('phone numbers and roles are validated', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post('/admin/users', [
            'name' => 'Invalid Details',
            'email' => 'valid@example.com',
            'phone' => 'not-a-phone',
            'role_id' => 999999,
            'status' => 'active',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])
        ->assertSessionHasErrors(['phone', 'role_id']);
});
