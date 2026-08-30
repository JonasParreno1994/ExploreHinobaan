<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Models\EnterpriseService;
use App\Models\Reservation;
use App\Models\ServiceSession;
use App\Notifications\NewPartnerActivityNotification;
use App\Notifications\ReservationStatusNotification;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function store(StoreReservationRequest $request): RedirectResponse
    {
        $reservation = DB::transaction(function () use ($request): Reservation {
            $service = EnterpriseService::query()->with('enterprise')->lockForUpdate()->findOrFail($request->integer('enterprise_service_id'));
            abort_unless($service->status === 'published' && $service->reservation_required && $service->enterprise->application_status === 'approved', 404);
            $data = $request->validated();
            $reservationFee = (float) ($service->enterprise->reservation_fee ?? 0);
            if ($reservationFee > 0 && ! $request->hasFile('payment_proof')) {
                throw ValidationException::withMessages(['payment_proof' => 'Please upload proof that you paid the reservation fee.']);
            }
            $paymentProofPath = $request->file('payment_proof')?->store('reservations/payment-proofs', 'public');
            $data['adults'] = $data['adults'] ?? $data['number_of_guests'];
            $data['children'] = $data['children'] ?? 0;
            $data['number_of_guests'] = $data['adults'] + $data['children'];
            $this->validateSchedule($service, $data);
            $session = $this->validatedSession($service, $data);
            $this->validateCapacity($service, $session, $data);
            $available = $this->availableQuantity($service, $data);
            if ($data['quantity'] > $available) {
                throw ValidationException::withMessages(['quantity' => "Only {$available} unit(s) are available for the selected schedule."]);
            }
            $units = $this->billableUnits($service, $data);
            $unitPrice = (float) ($session?->price ?? $service->price);
            $subtotal = round($unitPrice * $units, 2);
            $reservation = Reservation::create([
                'reservation_number' => 'HIN-'.now()->format('Y').'-'.Str::upper(Str::random(8)),
                'enterprise_id' => $service->enterprise_id,
                'customer_id' => $request->user()?->isTourist() ? $request->user()->id : null,
                'customer_name' => $data['customer_name'], 'customer_email' => $data['customer_email'], 'customer_contact' => $data['customer_contact'],
                'customer_address' => $data['customer_address'] ?? null,
                'total_amount' => $subtotal, 'status' => 'pending', 'special_request' => $data['special_request'] ?? null,
                'reservation_fee' => $reservationFee, 'payment_proof_path' => $paymentProofPath,
                'payment_status' => $reservationFee > 0 ? 'pending_verification' : 'not_required',
            ]);
            $reservation->items()->create([
                'enterprise_service_id' => $service->id, 'service_session_id' => $session?->id, 'quantity' => $data['quantity'],
                'number_of_guests' => $data['number_of_guests'], 'adults' => $data['adults'], 'children' => $data['children'],
                'check_in' => $data['check_in'] ?? null, 'check_out' => $data['check_out'] ?? null, 'reservation_date' => $data['reservation_date'] ?? null,
                'start_time' => $session?->start_time ?? ($data['start_time'] ?? null), 'end_time' => $session?->end_time ?? ($data['end_time'] ?? null), 'purpose' => $data['purpose'] ?? null,
                'unit_price' => $unitPrice, 'subtotal' => $subtotal,
            ]);

            return $reservation;
        });

        Notification::route('mail', $reservation->customer_email)
            ->notify(new ReservationStatusNotification($reservation));

        $enterprise = $reservation->enterprise()->with('user:id,name,email')->firstOrFail();
        $enterprise->user?->notify(new NewPartnerActivityNotification(
            activityType: 'reservation',
            title: 'New reservation received',
            message: "{$reservation->customer_name} submitted a reservation for {$enterprise->business_name}.",
            reference: $reservation->reservation_number,
            url: route('partner.reservations.show', $reservation),
        ));

        return to_route('reservations.success', $reservation->reservation_number);
    }

    public function success(string $reservationNumber): Response
    {
        $reservation = Reservation::query()->where('reservation_number', $reservationNumber)->with(['enterprise:id,business_name,slug', 'items.service:id,name,pricing_unit'])->firstOrFail();

        return Inertia::render('reservations/success', ['reservation' => $reservation]);
    }

    private function availableQuantity(EnterpriseService $service, array $data): int
    {
        $date = $data['reservation_date'] ?? $data['check_in'];
        $availability = $service->availabilities()->whereDate('date', $date)->first();
        if ($availability && in_array($availability->status, ['unavailable', 'maintenance', 'closed'], true)) {
            return 0;
        }
        $total = $availability?->available_quantity ?? $service->quantity;
        $reserved = $service->reservationItems()->whereHas('reservation', fn ($query) => $query->whereIn('status', ['pending', 'confirmed']))
            ->when(isset($data['check_in']), fn ($query) => $query->whereDate('check_in', '<', $data['check_out'])->whereDate('check_out', '>', $data['check_in']))
            ->when(isset($data['reservation_date']), fn ($query) => $query->whereDate('reservation_date', $data['reservation_date']))
            ->when($service->reservation_mode === 'timeslot' && isset($data['start_time'], $data['end_time']), fn ($query) => $query->where('start_time', '<', $data['end_time'])->where('end_time', '>', $data['start_time']))
            ->when(isset($data['service_session_id']), fn ($query) => $query->where('service_session_id', $data['service_session_id']))
            ->sum('quantity');

        return max(0, $total - $reserved);
    }

    private function billableUnits(EnterpriseService $service, array $data): float
    {
        return match ($service->pricing_unit) {
            'per_night' => max(1, Carbon::parse($data['check_in'])->diffInDays(Carbon::parse($data['check_out']))) * $data['quantity'],
            'per_hour' => max(1, ceil(Carbon::parse($data['start_time'])->diffInMinutes(Carbon::parse($data['end_time'])) / 60)) * $data['quantity'],
            'per_person' => $data['number_of_guests'],
            default => $data['quantity'],
        };
    }

    private function validatedSession(EnterpriseService $service, array $data): ?ServiceSession
    {
        if ($service->reservation_mode !== 'session') {
            return null;
        }

        if (empty($data['service_session_id'])) {
            throw ValidationException::withMessages(['service_session_id' => 'Please select an available session.']);
        }

        $session = $service->sessions()->whereKey($data['service_session_id'])->where('is_active', true)->first();
        if (! $session) {
            throw ValidationException::withMessages(['service_session_id' => 'The selected session is not available for this service.']);
        }

        return $session;
    }

    private function validateSchedule(EnterpriseService $service, array $data): void
    {
        if ($service->reservation_mode === 'overnight' && (empty($data['check_in']) || empty($data['check_out']))) {
            throw ValidationException::withMessages(['check_in' => 'Check-in and check-out dates are required for room reservations.']);
        }

        if (in_array($service->reservation_mode, ['day', 'timeslot', 'session'], true) && empty($data['reservation_date'])) {
            throw ValidationException::withMessages(['reservation_date' => 'A reservation date is required for this service.']);
        }

        if ($service->reservation_mode === 'timeslot' && (empty($data['start_time']) || empty($data['end_time']))) {
            throw ValidationException::withMessages(['start_time' => 'Start and end times are required for this service.']);
        }
    }

    private function validateCapacity(EnterpriseService $service, ?ServiceSession $session, array $data): void
    {
        $capacity = $session?->capacity ?? $service->capacity;
        $maximumGuests = $service->reservation_mode === 'session' ? $capacity : ($capacity ? $capacity * $data['quantity'] : null);

        if ($maximumGuests && $data['number_of_guests'] > $maximumGuests) {
            throw ValidationException::withMessages(['number_of_guests' => "This selection can accommodate a maximum of {$maximumGuests} guests."]);
        }
    }
}
