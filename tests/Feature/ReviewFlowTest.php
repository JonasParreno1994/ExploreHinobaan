<?php

use App\Models\Destination;
use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('visitor can submit destination feedback for moderation', function () {
    $destination = Destination::factory()->create(['status' => 'published']);
    $this->post(route('reviews.store'), ['target_type' => 'destination', 'target_id' => $destination->id, 'reviewer_name' => 'Juan Visitor', 'reviewer_email' => 'juan@example.com', 'rating' => 5, 'title' => 'Beautiful place', 'comment' => 'The destination was clean and beautiful.'])->assertRedirect()->assertSessionHasNoErrors();
    expect(Review::firstOrFail())->status->toBe('pending')->is_verified->toBeFalse();
});

test('completed reservation verifies a service review', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create(['status' => 'published']);
    $reservation = Reservation::create(['reservation_number' => 'HIN-REVIEW-001', 'enterprise_id' => $enterprise->id, 'customer_name' => 'Maria Guest', 'customer_email' => 'maria@example.com', 'customer_contact' => '09000000000', 'total_amount' => 1000, 'status' => 'completed']);
    $reservation->items()->create(['enterprise_service_id' => $service->id, 'quantity' => 1, 'number_of_guests' => 2, 'reservation_date' => today(), 'unit_price' => 1000, 'subtotal' => 1000]);

    $this->post(route('reviews.store'), ['target_type' => 'service', 'target_id' => $service->id, 'reviewer_name' => 'Maria Guest', 'reviewer_email' => 'maria@example.com', 'reference_number' => 'HIN-REVIEW-001', 'rating' => 4, 'comment' => 'The room service was comfortable and clean.'])->assertRedirect()->assertSessionHasNoErrors();
    expect(Review::firstOrFail())->is_verified->toBeTrue()->verification_source->toBe('completed_reservation');
});

test('service review is rejected without matching completed reservation', function () {
    $service = EnterpriseService::factory()->create(['status' => 'published']);
    $this->post(route('reviews.store'), ['target_type' => 'service', 'target_id' => $service->id, 'reviewer_name' => 'Unknown Guest', 'reviewer_email' => 'guest@example.com', 'reference_number' => 'INVALID', 'rating' => 3, 'comment' => 'This feedback should not be accepted yet.'])->assertSessionHasErrors('reference_number');
    expect(Review::count())->toBe(0);
});

test('admin can publish a review and it appears on the public destination page', function () {
    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    $destination = Destination::factory()->create(['status' => 'published']);
    $review = Review::factory()->for($destination, 'reviewable')->create(['rating' => 3]);
    $this->actingAs($administrator)->patch(route('admin.reviews.update', $review), ['status' => 'published'])->assertRedirect();
    $this->get(route('destinations.show', $destination))->assertSuccessful()->assertInertia(fn (Assert $page) => $page->has('reviews', 1)->where('reviewSummary.count', 1)->where('reviewSummary.average', 3));
});
