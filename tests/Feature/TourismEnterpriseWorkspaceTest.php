<?php

use App\Models\Enterprise;
use App\Models\EnterpriseDocument;
use App\Models\EnterpriseService;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
