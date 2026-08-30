<?php

namespace App\Http\Controllers;

use App\Http\Requests\LookupReservationRequest;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationStatusController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('reservations/check');
    }

    public function store(LookupReservationRequest $request): RedirectResponse
    {
        $reservation = Reservation::query()
            ->whereRaw('LOWER(customer_email) = ?', [strtolower($request->validated('customer_email'))])
            ->where('reservation_number', $request->validated('reservation_number'))
            ->first();

        if (! $reservation) {
            throw ValidationException::withMessages([
                'reservation_number' => 'We could not find a reservation matching those details.',
            ]);
        }

        return redirect()->to(URL::temporarySignedRoute('reservations.status.show', now()->addMinutes(30), ['reservation' => $reservation]));
    }

    public function show(Reservation $reservation): Response
    {
        $reservation->load(['enterprise:id,business_name,slug,email,phone', 'items.service:id,name,pricing_unit', 'items.session:id,name,start_time,end_time']);

        return Inertia::render('reservations/status', [
            'reservation' => [
                'reservation_number' => $reservation->reservation_number,
                'customer_name' => $reservation->customer_name,
                'total_amount' => $reservation->total_amount,
                'reservation_fee' => $reservation->reservation_fee,
                'payment_status' => $reservation->payment_status,
                'status' => $reservation->status,
                'rejection_reason' => $reservation->rejection_reason,
                'created_at' => $reservation->created_at,
                'updated_at' => $reservation->updated_at,
                'enterprise' => $reservation->enterprise,
                'items' => $reservation->items,
            ],
        ]);
    }
}
