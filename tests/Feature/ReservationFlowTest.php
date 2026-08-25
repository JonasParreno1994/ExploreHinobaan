<?php

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest reservation total is calculated by the backend', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create(['price' => 2500, 'pricing_unit' => 'per_night', 'quantity' => 5]);

    $response = $this->post(route('reservations.store'), [
        'enterprise_service_id' => $service->id, 'customer_name' => 'Juan Dela Cruz', 'customer_email' => 'juan@example.com',
        'customer_contact' => '09123456789', 'quantity' => 2, 'number_of_guests' => 4,
        'check_in' => now()->addDays(3)->toDateString(), 'check_out' => now()->addDays(5)->toDateString(),
    ]);

    $reservation = Reservation::firstOrFail();
    $response->assertRedirect(route('reservations.success', $reservation->reservation_number));
    expect($reservation->status)->toBe('pending')->and($reservation->total_amount)->toBe('10000.00');
});

test('confirmed overlapping inventory cannot be overbooked', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create(['quantity' => 1]);
    $reservation = Reservation::create(['reservation_number' => 'HIN-2026-EXISTING', 'enterprise_id' => $enterprise->id, 'customer_name' => 'Existing Guest', 'customer_email' => 'existing@example.com', 'customer_contact' => '09000000000', 'total_amount' => 100, 'status' => 'confirmed']);
    $reservation->items()->create(['enterprise_service_id' => $service->id, 'quantity' => 1, 'number_of_guests' => 1, 'check_in' => now()->addDays(3), 'check_out' => now()->addDays(5), 'unit_price' => 100, 'subtotal' => 100]);

    $this->post(route('reservations.store'), [
        'enterprise_service_id' => $service->id, 'customer_name' => 'New Guest', 'customer_email' => 'new@example.com',
        'customer_contact' => '09111111111', 'quantity' => 1, 'number_of_guests' => 1,
        'check_in' => now()->addDays(4)->toDateString(), 'check_out' => now()->addDays(6)->toDateString(),
    ])->assertSessionHasErrors('quantity');
});

test('a pending reservation cannot be confirmed after inventory is consumed', function () {
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $enterprise = Enterprise::factory()->for($owner)->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create(['quantity' => 1]);
    $dates = ['check_in' => now()->addDays(3), 'check_out' => now()->addDays(5)];

    $confirmed = Reservation::create(['reservation_number' => 'HIN-CONFIRMED', 'enterprise_id' => $enterprise->id, 'customer_name' => 'Guest One', 'customer_email' => 'one@example.com', 'customer_contact' => '09000000001', 'total_amount' => 100, 'status' => 'confirmed']);
    $confirmed->items()->create(['enterprise_service_id' => $service->id, 'quantity' => 1, 'number_of_guests' => 1, ...$dates, 'unit_price' => 100, 'subtotal' => 100]);
    $pending = Reservation::create(['reservation_number' => 'HIN-PENDING', 'enterprise_id' => $enterprise->id, 'customer_name' => 'Guest Two', 'customer_email' => 'two@example.com', 'customer_contact' => '09000000002', 'total_amount' => 100, 'status' => 'pending']);
    $pending->items()->create(['enterprise_service_id' => $service->id, 'quantity' => 1, 'number_of_guests' => 1, ...$dates, 'unit_price' => 100, 'subtotal' => 100]);

    $this->actingAs($owner)->patch(route('partner.reservations.status', $pending), ['status' => 'confirmed'])->assertSessionHasErrors('status');
    expect($pending->refresh()->status)->toBe('pending');
});
