<?php

use App\Models\Role;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $role = Role::factory()->create(['name' => 'Administrator']);
    $this->actingAs($user = User::factory()->for($role)->create());

    $this->get('/dashboard')->assertOk();
});
