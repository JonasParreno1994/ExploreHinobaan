<?php

use App\Models\Enterprise;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('tourism enterprise login page is publicly available', function () {
    $this->get(route('partner.login'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page->component('tourism-enterprise/login'));
});

test('a linked tourism enterprise account can sign in to the partner portal', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Tourism Enterprise']))->create();
    Enterprise::factory()->for($user)->create();

    $this->post(route('partner.login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('partner.dashboard'));
    $this->assertAuthenticatedAs($user);
});

test('an account without a tourism enterprise cannot sign in to the partner portal', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Tourism Enterprise']))->create();

    $this->post(route('partner.login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertInvalid(['email']);
    $this->assertGuest();
});

test('a linked account without the tourism enterprise role cannot use the partner login', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    Enterprise::factory()->for($user)->create();

    $this->post(route('partner.login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertInvalid(['email']);
    $this->assertGuest();
});

test('partner dashboard lists only the authenticated users enterprises', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Tourism Enterprise']))->create();
    $enterprise = Enterprise::factory()->for($user)->create(['business_name' => 'Partner Resort']);
    Enterprise::factory()->create(['business_name' => 'Another Business']);

    $this->actingAs($user)->get(route('partner.dashboard'))->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/dashboard')
        ->has('enterprises', 1)
        ->where('enterprises.0.id', $enterprise->id)
        ->where('statistics.enterprises', 1));
});
