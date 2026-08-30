<?php

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use App\Notifications\NewPartnerActivityNotification;
use App\Notifications\ReservationStatusNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('tourist receives a pending notification after submitting a reservation', function () {
    Notification::fake();
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $enterprise = Enterprise::factory()->for($owner)->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create();

    $this->post(route('reservations.store'), [
        'enterprise_service_id' => $service->id,
        'customer_name' => 'Tourist Guest',
        'customer_email' => 'tourist@example.com',
        'customer_contact' => '09123456789',
        'quantity' => 1,
        'number_of_guests' => 2,
        'reservation_date' => now()->addDays(3)->toDateString(),
    ])->assertRedirect();

    Notification::assertSentOnDemand(ReservationStatusNotification::class, function (ReservationStatusNotification $notification, array $channels, object $notifiable): bool {
        return $notification->reservation->status === 'pending'
            && $notifiable->routes['mail'] === 'tourist@example.com'
            && $channels === ['mail'];
    });
    Notification::assertSentTo(
        $owner,
        NewPartnerActivityNotification::class,
        fn (NewPartnerActivityNotification $notification): bool => $notification->activityType === 'reservation'
            && $notification->reference !== '',
    );
});

test('tourist receives a notification when the enterprise confirms a reservation', function () {
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $enterprise = Enterprise::factory()->for($owner)->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create(['quantity' => 2]);
    $reservation = Reservation::create([
        'reservation_number' => 'HIN-NOTIFY-CONFIRM',
        'enterprise_id' => $enterprise->id,
        'customer_name' => 'Tourist Guest',
        'customer_email' => 'tourist@example.com',
        'customer_contact' => '09123456789',
        'total_amount' => 1000,
        'status' => 'pending',
        'payment_status' => 'not_required',
    ]);
    $reservation->items()->create([
        'enterprise_service_id' => $service->id,
        'quantity' => 1,
        'number_of_guests' => 2,
        'reservation_date' => now()->addDays(3),
        'unit_price' => 1000,
        'subtotal' => 1000,
    ]);
    Notification::fake();

    $this->actingAs($owner)
        ->patch(route('partner.reservations.status', $reservation), ['status' => 'confirmed'])
        ->assertSessionHasNoErrors();

    expect($reservation->refresh()->status)->toBe('confirmed');
    Notification::assertSentOnDemand(ReservationStatusNotification::class, fn (ReservationStatusNotification $notification): bool => $notification->reservation->status === 'confirmed');
});

test('tourist can securely look up and view a reservation status', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create();
    $reservation = Reservation::create([
        'reservation_number' => 'HIN-LOOKUP-1234',
        'enterprise_id' => $enterprise->id,
        'customer_name' => 'Lookup Guest',
        'customer_email' => 'lookup@example.com',
        'customer_contact' => '09123456789',
        'total_amount' => 800,
        'status' => 'confirmed',
        'payment_status' => 'verified',
    ]);
    $reservation->items()->create([
        'enterprise_service_id' => $service->id,
        'quantity' => 1,
        'number_of_guests' => 2,
        'reservation_date' => now()->addDays(3),
        'unit_price' => 800,
        'subtotal' => 800,
    ]);

    $lookup = $this->post(route('reservations.status.store'), [
        'reservation_number' => 'HIN-LOOKUP-1234',
        'customer_email' => 'LOOKUP@example.com',
    ]);
    $lookup->assertRedirect();
    expect($lookup->headers->get('Location'))->toContain('/reservations/status/'.$reservation->id)->toContain('signature=');

    $signedUrl = URL::temporarySignedRoute('reservations.status.show', now()->addMinutes(5), ['reservation' => $reservation]);
    $this->get($signedUrl)
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reservations/status')
            ->where('reservation.reservation_number', 'HIN-LOOKUP-1234')
            ->where('reservation.status', 'confirmed'));

    $this->get(route('reservations.status.show', $reservation))->assertForbidden();
});

test('reservation lookup does not reveal whether only one credential matched', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    Reservation::create([
        'reservation_number' => 'HIN-PRIVATE-1234',
        'enterprise_id' => $enterprise->id,
        'customer_name' => 'Private Guest',
        'customer_email' => 'private@example.com',
        'customer_contact' => '09123456789',
        'total_amount' => 500,
        'status' => 'pending',
    ]);

    $this->post(route('reservations.status.store'), [
        'reservation_number' => 'HIN-PRIVATE-1234',
        'customer_email' => 'wrong@example.com',
    ])->assertSessionHasErrors(['reservation_number' => 'We could not find a reservation matching those details.']);
});
