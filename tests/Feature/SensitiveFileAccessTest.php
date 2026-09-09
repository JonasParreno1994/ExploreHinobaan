<?php

use App\Models\Enterprise;
use App\Models\EnterpriseDocument;
use App\Models\EnterpriseType;
use App\Models\LocalProductOrder;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function privateFileContext(): array
{
    $partnerRole = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($partnerRole)->create();
    $otherPartner = User::factory()->for($partnerRole)->create();
    $enterpriseType = EnterpriseType::factory()->create(['name' => 'Resort']);
    $enterprise = Enterprise::factory()->for($owner)->for($enterpriseType)->create(['application_status' => 'approved']);

    return [$owner, $otherPartner, $enterprise];
}

test('only tourism officers and the enterprise owner can view an enterprise document', function () {
    Storage::fake('local');
    [$owner, $otherPartner, $enterprise] = privateFileContext();
    $document = EnterpriseDocument::factory()->for($enterprise)->create(['file_path' => 'enterprise-documents/permit.pdf']);
    Storage::disk('local')->put($document->file_path, 'private permit');

    $this->get(route('secure-files.enterprise-documents.show', $document))->assertRedirect(route('login'));
    $this->actingAs($otherPartner)->get(route('secure-files.enterprise-documents.show', $document))->assertForbidden();
    $this->actingAs($owner)->get(route('secure-files.enterprise-documents.show', $document))
        ->assertSuccessful()->assertHeader('Cache-Control', 'no-store, private');

    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    $this->actingAs($administrator)->get(route('secure-files.enterprise-documents.show', $document))->assertSuccessful();
});

test('reservation payment proof is private to authorized account holders', function () {
    Storage::fake('local');
    [$owner, $otherPartner, $enterprise] = privateFileContext();
    $customer = User::factory()->for(Role::query()->firstOrCreate(['name' => 'Tourist']))->create();
    $reservation = Reservation::create([
        'reservation_number' => 'HIN-PRIVATE-1', 'enterprise_id' => $enterprise->id, 'customer_id' => $customer->id,
        'customer_name' => 'Guest', 'customer_email' => 'guest@example.com', 'customer_contact' => '09123456789',
        'total_amount' => 100, 'payment_proof_path' => 'reservations/payment-proofs/proof.jpg',
    ]);
    Storage::disk('local')->put($reservation->payment_proof_path, 'private receipt');

    $this->actingAs($otherPartner)->get(route('secure-files.reservation-payment-proofs.show', $reservation))->assertForbidden();
    $this->actingAs($owner)->get(route('secure-files.reservation-payment-proofs.show', $reservation))->assertSuccessful();
    $this->actingAs($customer)->get(route('secure-files.reservation-payment-proofs.show', $reservation))->assertSuccessful();
});

test('product order payment proof is private to authorized account holders', function () {
    Storage::fake('local');
    [$owner, $otherPartner, $enterprise] = privateFileContext();
    $customer = User::factory()->for(Role::query()->firstOrCreate(['name' => 'Tourist']))->create();
    $order = LocalProductOrder::create([
        'order_number' => 'HIN-PROD-PRIVATE-1', 'enterprise_id' => $enterprise->id, 'customer_id' => $customer->id,
        'customer_name' => 'Guest', 'customer_email' => 'guest@example.com', 'customer_contact' => '09123456789',
        'fulfillment_method' => 'pickup', 'subtotal' => 100, 'delivery_fee' => 0, 'total_amount' => 100,
        'payment_method' => 'gcash', 'payment_proof_path' => 'local-product-orders/payment-proofs/proof.jpg',
    ]);
    Storage::disk('local')->put($order->payment_proof_path, 'private receipt');

    $this->actingAs($otherPartner)->get(route('secure-files.product-order-payment-proofs.show', $order))->assertForbidden();
    $this->actingAs($owner)->get(route('secure-files.product-order-payment-proofs.show', $order))->assertSuccessful();
    $this->actingAs($customer)->get(route('secure-files.product-order-payment-proofs.show', $order))->assertSuccessful();
});

test('migration command moves legacy sensitive files off the public disk', function () {
    Storage::fake('public');
    Storage::fake('local');
    [, , $enterprise] = privateFileContext();
    $document = EnterpriseDocument::factory()->for($enterprise)->create(['file_path' => 'enterprise-documents/legacy.pdf']);
    Storage::disk('public')->put($document->file_path, 'legacy permit');

    $this->artisan('sensitive-files:migrate-to-private')->assertSuccessful();

    Storage::disk('local')->assertExists($document->file_path);
    Storage::disk('public')->assertMissing($document->file_path);
});
