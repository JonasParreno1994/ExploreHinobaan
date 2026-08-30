<?php

use App\Models\Enterprise;
use App\Models\EnterpriseDocument;
use App\Models\EnterpriseService;
use App\Models\EnterpriseType;
use App\Models\LocalProductOrder;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\ServiceSession;
use App\Models\User;
use App\Notifications\NewPartnerActivityNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function partnerWithEnterprise(): array
{
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $user = User::factory()->for($role)->create();
    $enterprise = Enterprise::factory()->for($user)->create(['application_status' => 'approved']);

    return [$user, $enterprise];
}

test('partner dashboard shows reservation analytics for owned enterprises only', function () {
    [$user, $enterprise] = partnerWithEnterprise();
    $service = EnterpriseService::factory()->for($enterprise)->create();
    $reservation = Reservation::create(['reservation_number' => 'HIN-ANALYTICS', 'enterprise_id' => $enterprise->id, 'customer_name' => 'Tourist Guest', 'customer_email' => 'guest@example.com', 'customer_contact' => '09123456789', 'total_amount' => 1500, 'status' => 'completed']);
    $reservation->items()->create(['enterprise_service_id' => $service->id, 'quantity' => 1, 'number_of_guests' => 4, 'reservation_date' => today(), 'unit_price' => 1500, 'subtotal' => 1500]);
    $otherEnterprise = Enterprise::factory()->create();
    Reservation::create(['reservation_number' => 'HIN-OTHER', 'enterprise_id' => $otherEnterprise->id, 'customer_name' => 'Other Guest', 'customer_email' => 'other@example.com', 'customer_contact' => '09000000000', 'total_amount' => 900, 'status' => 'completed']);

    $this->actingAs($user)->get(route('partner.dashboard'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/dashboard')
        ->where('statistics.reservations', 1)
        ->where('statistics.completed_reservations', 1)
        ->where('statistics.accommodated_guests', 4)
        ->where('statistics.confirmed_revenue', 1500)
        ->has('recentReservations', 1)
        ->has('reservationTrend', 6));
});

test('local product producer dashboard uses product order workspace', function () {
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $user = User::factory()->for($role)->create();
    $producerType = EnterpriseType::factory()->create(['name' => 'Local Product Seller']);
    $enterprise = Enterprise::factory()->for($user)->for($producerType)->create(['application_status' => 'approved']);

    LocalProductOrder::create([
        'order_number' => 'HIN-PRODUCT-001',
        'enterprise_id' => $enterprise->id,
        'customer_name' => 'Product Buyer',
        'customer_email' => 'buyer@example.com',
        'customer_contact' => '09123456789',
        'fulfillment_method' => 'pickup',
        'subtotal' => 750,
        'delivery_fee' => 0,
        'total_amount' => 750,
        'payment_method' => 'cash',
        'status' => 'completed',
    ]);

    $this->actingAs($user)->get(route('partner.dashboard'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/dashboard')
        ->where('isLocalProductProducer', true)
        ->where('partnerWorkspace.is_local_product_producer', true)
        ->where('productStatistics.orders', 1)
        ->where('productStatistics.completed_orders', 1)
        ->where('productStatistics.sales_revenue', 750)
        ->has('recentProductOrders', 1)
        ->has('productOrderTrend', 6));
});

test('partner can view and mark owned notifications as read', function () {
    [$user] = partnerWithEnterprise();
    $otherUser = User::factory()->create();
    $user->notify(new NewPartnerActivityNotification('reservation', 'New reservation received', 'A tourist submitted a reservation.', 'HIN-NOTIFY-001', route('partner.reservations.index')));
    $otherUser->notify(new NewPartnerActivityNotification('product_order', 'New product order received', 'A tourist submitted an order.', 'HIN-OTHER-001', route('partner.product-orders.index')));
    $notification = $user->unreadNotifications()->firstOrFail();
    $otherNotification = $otherUser->unreadNotifications()->firstOrFail();

    $this->actingAs($user)->get(route('partner.dashboard'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->where('partnerNotifications.unread_count', 1)
        ->where('partnerNotifications.items.0.data.reference', 'HIN-NOTIFY-001'));

    $this->actingAs($user)->patch(route('partner.notifications.read', $notification))->assertRedirect();
    expect($notification->refresh()->read_at)->not->toBeNull();
    $this->actingAs($user)->patch(route('partner.notifications.read', $otherNotification))->assertForbidden();
});

test('my enterprises page only displays enterprises owned by the partner', function () {
    [$user, $enterprise] = partnerWithEnterprise();
    Enterprise::factory()->create();

    $this->actingAs($user)->get(route('partner.enterprises.index'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/enterprises/index')
        ->has('enterprises', 1)
        ->where('enterprises.0.id', $enterprise->id));
});

test('documents page only displays registration documents owned by the partner', function () {
    [$user, $enterprise] = partnerWithEnterprise();
    $document = EnterpriseDocument::factory()->for($enterprise)->create();
    EnterpriseDocument::factory()->create();

    $this->actingAs($user)->get(route('partner.documents.index'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/documents/index')
        ->has('documents', 1)
        ->where('documents.0.id', $document->id));
});

test('partner reservations page loads reservations with service sessions', function () {
    [$user, $enterprise] = partnerWithEnterprise();
    $service = EnterpriseService::factory()->for($enterprise)->create();
    $session = ServiceSession::factory()->for($service, 'service')->create();
    $reservation = Reservation::create([
        'reservation_number' => 'HIN-SESSION-TEST',
        'enterprise_id' => $enterprise->id,
        'customer_name' => 'Session Guest',
        'customer_email' => 'session@example.com',
        'customer_contact' => '09123456789',
        'total_amount' => $session->price,
        'status' => 'pending',
    ]);
    $reservation->items()->create([
        'enterprise_service_id' => $service->id,
        'service_session_id' => $session->id,
        'quantity' => 1,
        'number_of_guests' => 2,
        'reservation_date' => today(),
        'unit_price' => $session->price,
        'subtotal' => $session->price,
    ]);

    $this->actingAs($user)->get(route('partner.reservations.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tourism-enterprise/reservations/index')
            ->where('reservations.data.0.items.0.session.name', $session->name));
});

test('partner can save reservation fee and gcash qr for an owned enterprise', function () {
    Storage::fake('public');
    [$user, $enterprise] = partnerWithEnterprise();

    $this->actingAs($user)->post(route('partner.enterprises.payment-settings', $enterprise), [
        'reservation_fee' => 500,
        'gcash_qr' => UploadedFile::fake()->create('gcash-qr.png', 100, 'image/png'),
    ])->assertRedirect()->assertSessionHasNoErrors();

    expect($enterprise->refresh()->reservation_fee)->toBe('500.00')
        ->and($enterprise->gcash_qr_path)->not->toBeNull();
    Storage::disk('public')->assertExists($enterprise->gcash_qr_path);
});
