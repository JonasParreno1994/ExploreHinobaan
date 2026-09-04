<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Notifications\ReservationPaymentStatusNotification;
use App\Notifications\ReservationStatusNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $reservations = Reservation::query()->whereHas('enterprise', fn ($query) => $query->where('user_id', $request->user()->id))
            ->with(['enterprise:id,business_name', 'items.service.serviceType:id,name', 'items.session:id,name'])->latest()->paginate(15);

        return Inertia::render('tourism-enterprise/reservations/index', ['reservations' => $reservations]);
    }

    public function show(Request $request, Reservation $reservation): Response
    {
        abort_unless($reservation->enterprise()->where('user_id', $request->user()->id)->exists(), 403);

        return Inertia::render('tourism-enterprise/reservations/show', ['reservation' => $reservation->load(['enterprise:id,business_name', 'customer.touristVerification:id,user_id,verification_status', 'items.service.serviceType:id,name', 'items.session:id,name,start_time,end_time'])]);
    }

    public function updateStatus(Request $request, Reservation $reservation): RedirectResponse
    {
        abort_unless($reservation->enterprise()->where('user_id', $request->user()->id)->exists(), 403);
        $data = $request->validate(['status' => ['required', Rule::in(['confirmed', 'rejected', 'completed', 'cancelled'])], 'rejection_reason' => ['nullable', 'required_if:status,rejected', 'string', 'max:1000']]);
        $allowed = ['pending' => ['confirmed', 'rejected'], 'confirmed' => ['completed', 'cancelled']];
        abort_unless(in_array($data['status'], $allowed[$reservation->status] ?? [], true), 422);
        if ($data['status'] === 'confirmed' && (float) $reservation->reservation_fee > 0 && $reservation->payment_status !== 'verified') {
            throw ValidationException::withMessages(['status' => 'Verify the reservation fee payment before confirming this reservation.']);
        }
        DB::transaction(function () use ($reservation, $data): void {
            if ($data['status'] === 'confirmed') {
                $this->ensureInventoryIsAvailable($reservation);
            }

            $reservation->update($data);
        });

        $reservation->refresh();
        if ($reservation->customer) {
            $reservation->customer->notify(new ReservationStatusNotification($reservation));
        } else {
            Notification::route('mail', $reservation->customer_email)
                ->notify(new ReservationStatusNotification($reservation));
        }

        return back()->with('success', 'Reservation status updated.');
    }

    public function verifyPayment(Request $request, Reservation $reservation): RedirectResponse
    {
        abort_unless($reservation->enterprise()->where('user_id', $request->user()->id)->exists(), 403);
        $data = $request->validate(['payment_status' => ['required', Rule::in(['verified', 'rejected'])]]);
        abort_unless($reservation->payment_proof_path && $reservation->payment_status === 'pending_verification', 422);
        $reservation->update(['payment_status' => $data['payment_status'], 'payment_verified_at' => $data['payment_status'] === 'verified' ? now() : null]);

        if ($reservation->customer) {
            $reservation->customer->notify(new ReservationPaymentStatusNotification($reservation->refresh()));
        } else {
            Notification::route('mail', $reservation->customer_email)
                ->notify(new ReservationPaymentStatusNotification($reservation->refresh()));
        }

        return back()->with('success', 'Payment status updated.');
    }

    private function ensureInventoryIsAvailable(Reservation $reservation): void
    {
        $reservation->load('items.service');

        foreach ($reservation->items as $item) {
            $service = $item->service()->lockForUpdate()->firstOrFail();
            $reserved = $service->reservationItems()
                ->where('reservation_id', '!=', $reservation->id)
                ->whereHas('reservation', fn ($query) => $query->whereIn('status', ['pending', 'confirmed']))
                ->when($item->check_in, fn ($query) => $query
                    ->whereDate('check_in', '<', $item->check_out)
                    ->whereDate('check_out', '>', $item->check_in))
                ->when($item->reservation_date, fn ($query) => $query->whereDate('reservation_date', $item->reservation_date))
                ->when($item->start_time && $item->end_time, fn ($query) => $query->where('start_time', '<', $item->end_time)->where('end_time', '>', $item->start_time))
                ->when($item->service_session_id, fn ($query) => $query->where('service_session_id', $item->service_session_id))
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
