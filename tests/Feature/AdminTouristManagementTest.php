<?php

use App\Models\Enterprise;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\TouristVerification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function adminTouristUserWithRole(string $role): User
{
    return User::factory()->for(Role::query()->firstOrCreate(['name' => $role]))->create();
}

test('administrator sees only tourist accounts with their verification and reservation counts', function () {
    $administrator = adminTouristUserWithRole('Administrator');
    $tourist = adminTouristUserWithRole('Tourist');
    adminTouristUserWithRole('Tourism Enterprise');
    TouristVerification::factory()->for($tourist)->create(['verification_status' => 'verified']);
    $enterprise = Enterprise::factory()->create();
    Reservation::query()->create(['reservation_number' => 'HIN-ADMIN-001', 'enterprise_id' => $enterprise->id, 'customer_id' => $tourist->id, 'customer_name' => $tourist->name, 'customer_email' => $tourist->email, 'customer_contact' => '09123456789', 'total_amount' => 1000, 'status' => 'confirmed']);

    $this->actingAs($administrator)->get(route('admin.tourists.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/tourists/index')
            ->has('tourists.data', 1)
            ->where('tourists.data.0.id', $tourist->id)
            ->where('tourists.data.0.reservations_count', 1)
            ->where('tourists.data.0.tourist_verification.verification_status', 'verified'));
});

test('tourist filters work together', function () {
    $administrator = adminTouristUserWithRole('Administrator');
    $matchingTourist = adminTouristUserWithRole('Tourist');
    $matchingTourist->update(['name' => 'Maria Verified']);
    TouristVerification::factory()->for($matchingTourist)->create(['verification_status' => 'verified']);
    $otherTourist = adminTouristUserWithRole('Tourist');
    $otherTourist->update(['name' => 'Juan Pending']);
    TouristVerification::factory()->for($otherTourist)->create(['verification_status' => 'pending']);

    $this->actingAs($administrator)->get(route('admin.tourists.index', ['search' => 'Maria', 'identity_status' => 'verified', 'status' => 'active']))
        ->assertInertia(fn (Assert $page) => $page->has('tourists.data', 1)->where('tourists.data.0.id', $matchingTourist->id));
});

test('administrator can view a tourist reservation history but not a non tourist account', function () {
    $administrator = adminTouristUserWithRole('Administrator');
    $tourist = adminTouristUserWithRole('Tourist');
    $enterpriseUser = adminTouristUserWithRole('Tourism Enterprise');
    $enterprise = Enterprise::factory()->create();
    Reservation::query()->create(['reservation_number' => 'HIN-HISTORY-001', 'enterprise_id' => $enterprise->id, 'customer_id' => $tourist->id, 'customer_name' => $tourist->name, 'customer_email' => $tourist->email, 'customer_contact' => '09123456789', 'total_amount' => 2500, 'status' => 'completed']);

    $this->actingAs($administrator)->get(route('admin.tourists.show', $tourist))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('admin/tourists/show')->where('tourist.id', $tourist->id)->has('reservations.data', 1)->where('reservationSummary.completed', 1));
    $this->get(route('admin.tourists.show', $enterpriseUser))->assertNotFound();
});

test('only an administrator can suspend and reactivate a tourist account', function () {
    $administrator = adminTouristUserWithRole('Administrator');
    $staff = adminTouristUserWithRole('Tourism Staff');
    $tourist = adminTouristUserWithRole('Tourist');

    $this->actingAs($staff)->patch(route('admin.tourists.status', $tourist), ['status' => 'suspended'])->assertForbidden();
    $this->actingAs($administrator)->patch(route('admin.tourists.status', $tourist), ['status' => 'suspended'])->assertRedirect();
    expect($tourist->refresh()->status)->toBe('suspended');
    $this->patch(route('admin.tourists.status', $tourist), ['status' => 'active'])->assertRedirect();
    expect($tourist->refresh()->status)->toBe('active');
});

test('tourists and enterprise users cannot access admin tourist management', function () {
    $tourist = adminTouristUserWithRole('Tourist');
    $enterprise = adminTouristUserWithRole('Tourism Enterprise');

    $this->actingAs($tourist)->get(route('admin.tourists.index'))->assertForbidden();
    $this->actingAs($enterprise)->get(route('admin.tourists.index'))->assertForbidden();
});
