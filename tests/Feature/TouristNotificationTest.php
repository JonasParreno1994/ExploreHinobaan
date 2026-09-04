<?php

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\EnterpriseType;
use App\Models\LocalProductOrder;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use App\Notifications\LocalProductOrderStatusNotification;
use App\Notifications\NewPartnerActivityNotification;
use App\Notifications\ReservationPaymentStatusNotification;
use App\Notifications\ReservationStatusNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function notificationUser(string $role): User
{
    return User::factory()->for(Role::query()->firstOrCreate(['name' => $role]))->create();
}

function touristReservation(User $tourist, User $owner): Reservation
{
    $enterprise = Enterprise::factory()->for($owner)->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create(['quantity' => 3]);
    $reservation = Reservation::query()->create([
        'reservation_number' => 'HIN-TOURIST-NOTIFY', 'enterprise_id' => $enterprise->id, 'customer_id' => $tourist->id,
        'customer_name' => $tourist->name, 'customer_email' => $tourist->email, 'customer_contact' => '09123456789',
        'total_amount' => 1200, 'status' => 'pending', 'payment_status' => 'not_required',
    ]);
    $reservation->items()->create(['enterprise_service_id' => $service->id, 'quantity' => 1, 'number_of_guests' => 2, 'reservation_date' => now()->addDays(2), 'unit_price' => 1200, 'subtotal' => 1200]);

    return $reservation;
}

test('a registered tourist receives email and account notification when a reservation changes', function () {
    $tourist = notificationUser('Tourist');
    $owner = notificationUser('Tourism Enterprise');
    $reservation = touristReservation($tourist, $owner);
    Notification::fake();

    $this->actingAs($owner)->patch(route('partner.reservations.status', $reservation), ['status' => 'confirmed'])->assertRedirect();

    Notification::assertSentTo($tourist, ReservationStatusNotification::class, fn (ReservationStatusNotification $notification, array $channels): bool => $notification->reservation->status === 'confirmed' && $channels === ['mail', 'database']);
});

test('a registered tourist receives a payment verification notification', function () {
    $tourist = notificationUser('Tourist');
    $owner = notificationUser('Tourism Enterprise');
    $reservation = touristReservation($tourist, $owner);
    $reservation->update(['reservation_fee' => 200, 'payment_status' => 'pending_verification', 'payment_proof_path' => 'proof.jpg']);
    Notification::fake();

    $this->actingAs($owner)->patch(route('partner.reservations.payment', $reservation), ['payment_status' => 'verified'])->assertRedirect();

    Notification::assertSentTo($tourist, ReservationPaymentStatusNotification::class, fn (ReservationPaymentStatusNotification $notification): bool => $notification->reservation->payment_status === 'verified');
});

test('a registered tourist receives an account notification when a product order changes', function () {
    $tourist = notificationUser('Tourist');
    $owner = notificationUser('Tourism Enterprise');
    $producerType = EnterpriseType::factory()->create(['name' => 'Local Product Seller', 'slug' => 'local-product-seller']);
    $enterprise = Enterprise::factory()->for($owner)->for($producerType)->create(['application_status' => 'approved']);
    $order = LocalProductOrder::query()->create([
        'order_number' => 'HIN-PRODUCT-NOTIFY', 'enterprise_id' => $enterprise->id, 'customer_id' => $tourist->id,
        'customer_name' => $tourist->name, 'customer_email' => $tourist->email, 'customer_contact' => '09123456789',
        'fulfillment_method' => 'pickup', 'subtotal' => 500, 'delivery_fee' => 0, 'total_amount' => 500,
        'payment_method' => 'cash_on_pickup', 'payment_status' => 'unpaid', 'status' => 'pending',
    ]);
    Notification::fake();

    $this->actingAs($owner)->patch(route('partner.product-orders.update', $order), ['status' => 'accepted'])->assertRedirect();

    Notification::assertSentTo($tourist, LocalProductOrderStatusNotification::class, fn (LocalProductOrderStatusNotification $notification, array $channels): bool => $notification->order->status === 'accepted' && $channels === ['mail', 'database']);
});

test('tourist can view and mark only their own notifications as read', function () {
    $tourist = notificationUser('Tourist');
    $otherTourist = notificationUser('Tourist');
    $tourist->notify(new NewPartnerActivityNotification('reservation', 'Reservation confirmed', 'Your reservation is confirmed.', 'HIN-001', route('tourist.reservations.index')));
    $otherTourist->notify(new NewPartnerActivityNotification('reservation', 'Other notification', 'Private notification.', 'HIN-002', route('tourist.reservations.index')));
    $notification = $tourist->unreadNotifications()->firstOrFail();
    $otherNotification = $otherTourist->unreadNotifications()->firstOrFail();

    $this->actingAs($tourist)->get(route('tourist.notifications.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('tourist/notifications/index')->has('notifications.data', 1)->where('notifications.data.0.id', $notification->id));
    $this->patch(route('tourist.notifications.read', $otherNotification))->assertForbidden();
    $this->patch(route('tourist.notifications.read', $notification))->assertRedirect();
    expect($notification->refresh()->read_at)->not->toBeNull();
});

test('tourist can mark all owned notifications as read', function () {
    $tourist = notificationUser('Tourist');
    $otherTourist = notificationUser('Tourist');
    $tourist->notify(new NewPartnerActivityNotification('reservation', 'One', 'First update.', 'HIN-001', route('tourist.reservations.index')));
    $tourist->notify(new NewPartnerActivityNotification('reservation', 'Two', 'Second update.', 'HIN-002', route('tourist.reservations.index')));
    $otherTourist->notify(new NewPartnerActivityNotification('reservation', 'Other', 'Other update.', 'HIN-003', route('tourist.reservations.index')));

    $this->actingAs($tourist)->patch(route('tourist.notifications.read-all'))->assertRedirect();

    expect($tourist->unreadNotifications()->count())->toBe(0)->and($otherTourist->unreadNotifications()->count())->toBe(1);
});
