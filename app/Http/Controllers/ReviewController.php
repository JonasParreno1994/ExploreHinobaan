<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Destination;
use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\LocalProduct;
use App\Models\LocalProductOrder;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $target = $this->target($data['target_type'], (int) $data['target_id']);
        [$verified, $reservation, $order, $source] = $this->verification($target, $data['target_type'], $data['reviewer_email'], $data['reference_number'] ?? null);

        if ($data['target_type'] !== 'destination' && ! $verified) {
            throw ValidationException::withMessages(['reference_number' => 'Enter a completed reservation or order reference matching this email and item.']);
        }

        $duplicate = $target->reviews()->whereRaw('LOWER(reviewer_email) = ?', [strtolower($data['reviewer_email'])])
            ->when($reservation, fn ($query) => $query->where('reservation_id', $reservation->id))
            ->when($order, fn ($query) => $query->where('local_product_order_id', $order->id))->exists();
        throw_if($duplicate, ValidationException::withMessages(['reference_number' => 'A review has already been submitted for this record.']));

        $target->reviews()->create([
            'user_id' => $request->user()?->id, 'reservation_id' => $reservation?->id, 'local_product_order_id' => $order?->id,
            'reviewer_name' => $data['reviewer_name'], 'reviewer_email' => strtolower($data['reviewer_email']),
            'rating' => $data['rating'], 'title' => $data['title'] ?? null, 'comment' => $data['comment'],
            'is_verified' => $verified, 'verification_source' => $source, 'status' => 'pending',
        ]);

        return back()->with('success', 'Thank you. Your review was submitted for moderation.');
    }

    private function target(string $type, int $id): Model
    {
        $target = match ($type) {
            'destination' => Destination::query()->where('status', 'published')->find($id),
            'enterprise' => Enterprise::query()->where('application_status', 'approved')->find($id),
            'service' => EnterpriseService::query()->where('status', 'published')->find($id),
            'product' => LocalProduct::query()->where('status', 'published')->find($id),
        };
        abort_unless($target, 404);

        return $target;
    }

    private function verification(Model $target, string $type, string $email, ?string $reference): array
    {
        if ($type === 'destination' || ! $reference) {
            return [false, null, null, null];
        }
        $reservation = Reservation::query()->where('reservation_number', $reference)->whereRaw('LOWER(customer_email) = ?', [strtolower($email)])->where('status', 'completed')
            ->when($type === 'enterprise', fn ($query) => $query->where('enterprise_id', $target->getKey()))
            ->when($type === 'service', fn ($query) => $query->whereHas('items', fn ($items) => $items->where('enterprise_service_id', $target->getKey())))->first();
        if ($reservation) {
            return [true, $reservation, null, 'completed_reservation'];
        }
        $order = LocalProductOrder::query()->where('order_number', $reference)->whereRaw('LOWER(customer_email) = ?', [strtolower($email)])->where('status', 'completed')
            ->when($type === 'enterprise', fn ($query) => $query->where('enterprise_id', $target->getKey()))
            ->when($type === 'product', fn ($query) => $query->whereHas('items', fn ($items) => $items->where('local_product_id', $target->getKey())))->first();

        return [$order !== null, null, $order, $order ? 'completed_order' : null];
    }
}
