<?php

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\ServiceSession;
use App\Models\ServiceType;
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

    $response->assertSessionHasNoErrors();
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

test('room reservations enforce guest capacity across selected rooms', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $roomType = ServiceType::factory()->create(['name' => 'Room']);
    $service = EnterpriseService::factory()->for($enterprise)->for($roomType, 'serviceType')->create([
        'reservation_mode' => 'overnight', 'capacity' => 4, 'quantity' => 5,
    ]);

    $this->post(route('reservations.store'), [
        'enterprise_service_id' => $service->id, 'customer_name' => 'Large Group', 'customer_email' => 'group@example.com',
        'customer_contact' => '09123456789', 'quantity' => 2, 'number_of_guests' => 9, 'adults' => 7, 'children' => 2,
        'check_in' => now()->addDays(3)->toDateString(), 'check_out' => now()->addDays(5)->toDateString(),
    ])->assertSessionHasErrors('number_of_guests');
});

test('private pool sessions use the session price and prevent duplicate pending bookings', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $poolType = ServiceType::factory()->create(['name' => 'Swimming Pool']);
    $service = EnterpriseService::factory()->for($enterprise)->for($poolType, 'serviceType')->create([
        'reservation_mode' => 'session', 'pool_type' => 'private', 'pricing_unit' => 'per_session', 'quantity' => 1, 'capacity' => 25,
    ]);
    $session = ServiceSession::factory()->for($service, 'service')->create(['price' => 3000, 'capacity' => 25]);
    $reservationDate = now()->addDays(4)->toDateString();
    $payload = [
        'enterprise_service_id' => $service->id, 'service_session_id' => $session->id, 'customer_name' => 'Pool Guest',
        'customer_email' => 'pool@example.com', 'customer_contact' => '09123456789', 'quantity' => 1,
        'number_of_guests' => 15, 'adults' => 10, 'children' => 5, 'reservation_date' => $reservationDate,
    ];

    $this->post(route('reservations.store'), $payload)->assertRedirect();
    $savedReservation = Reservation::query()->with('items')->firstOrFail();
    expect($savedReservation->total_amount)->toBe('3000.00')
        ->and($savedReservation->items->first()->service_session_id)->toBe($session->id)
        ->and($savedReservation->items->first()->reservation_date->toDateString())->toBe($reservationDate);

    $this->post(route('reservations.store'), [...$payload, 'customer_email' => 'second@example.com'])
        ->assertSessionHasErrors('quantity');
});

test('reservation fee requires payment proof before a reservation is submitted', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved', 'reservation_fee' => 500]);
    $service = EnterpriseService::factory()->for($enterprise)->create();

    $this->post(route('reservations.store'), [
        'enterprise_service_id' => $service->id, 'customer_name' => 'Paying Guest', 'customer_email' => 'pay@example.com',
        'customer_contact' => '09123456789', 'quantity' => 1, 'number_of_guests' => 1,
        'reservation_date' => now()->addDays(3)->toDateString(),
    ])->assertSessionHasErrors('payment_proof');

    expect(Reservation::query()->count())->toBe(0);
});
