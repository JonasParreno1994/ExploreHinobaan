<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $reservations = Reservation::query()->whereHas('enterprise', fn ($query) => $query->where('user_id', $request->user()->id))
            ->with(['enterprise:id,business_name', 'items.service:id,name'])->latest()->paginate(15);

        return Inertia::render('tourism-enterprise/reservations/index', ['reservations' => $reservations]);
    }

    public function show(Request $request, Reservation $reservation): Response
    {
        abort_unless($reservation->enterprise()->where('user_id', $request->user()->id)->exists(), 403);

        return Inertia::render('tourism-enterprise/reservations/show', ['reservation' => $reservation->load(['enterprise:id,business_name', 'items.service:id,name,pricing_unit'])]);
    }

    public function updateStatus(Request $request, Reservation $reservation): RedirectResponse
    {
        abort_unless($reservation->enterprise()->where('user_id', $request->user()->id)->exists(), 403);
        $data = $request->validate(['status' => ['required', Rule::in(['confirmed', 'rejected', 'completed', 'cancelled'])], 'rejection_reason' => ['nullable', 'required_if:status,rejected', 'string', 'max:1000']]);
        $allowed = ['pending' => ['confirmed', 'rejected'], 'confirmed' => ['completed', 'cancelled']];
        abort_unless(in_array($data['status'], $allowed[$reservation->status] ?? [], true), 422);
        DB::transaction(function () use ($reservation, $data): void {
            if ($data['status'] === 'confirmed') {
                $this->ensureInventoryIsAvailable($reservation);
            }

            $reservation->update($data);
        });

        return back()->with('success', 'Reservation status updated.');
    }

    private function ensureInventoryIsAvailable(Reservation $reservation): void
    {
        $reservation->load('items.service');

        foreach ($reservation->items as $item) {
            $service = $item->service()->lockForUpdate()->firstOrFail();
            $reserved = $service->reservationItems()
                ->where('reservation_id', '!=', $reservation->id)
                ->whereHas('reservation', fn ($query) => $query->where('status', 'confirmed'))
                ->when($item->check_in, fn ($query) => $query
                    ->whereDate('check_in', '<', $item->check_out)
                    ->whereDate('check_out', '>', $item->check_in))
                ->when($item->reservation_date, fn ($query) => $query->whereDate('reservation_date', $item->reservation_date))
                ->sum('quantity');

            if ($reserved + $item->quantity > $service->quantity) {
                $available = max(0, $service->quantity - $reserved);

                throw ValidationException::withMessages([
                    'status' => "This reservation cannot be confirmed. Only {$available} unit(s) remain available.",
                ]);
            }
        }
    }
}
