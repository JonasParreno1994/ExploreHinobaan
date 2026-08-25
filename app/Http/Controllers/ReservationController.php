<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Models\EnterpriseService;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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
            $available = $this->availableQuantity($service, $data);
            if ($data['quantity'] > $available) {
                throw ValidationException::withMessages(['quantity' => "Only {$available} unit(s) are available for the selected schedule."]);
            }
            $units = $this->billableUnits($service, $data);
            $subtotal = round((float) $service->price * $units, 2);
            $reservation = Reservation::create([
                'reservation_number' => 'HIN-'.now()->format('Y').'-'.Str::upper(Str::random(8)),
                'enterprise_id' => $service->enterprise_id,
                'customer_id' => $request->user()?->id,
                'customer_name' => $data['customer_name'], 'customer_email' => $data['customer_email'], 'customer_contact' => $data['customer_contact'],
                'total_amount' => $subtotal, 'status' => 'pending', 'special_request' => $data['special_request'] ?? null,
            ]);
            $reservation->items()->create([
                'enterprise_service_id' => $service->id, 'quantity' => $data['quantity'], 'number_of_guests' => $data['number_of_guests'],
                'check_in' => $data['check_in'] ?? null, 'check_out' => $data['check_out'] ?? null, 'reservation_date' => $data['reservation_date'] ?? null,
                'start_time' => $data['start_time'] ?? null, 'end_time' => $data['end_time'] ?? null, 'purpose' => $data['purpose'] ?? null,
                'unit_price' => $service->price, 'subtotal' => $subtotal,
            ]);

            return $reservation;
        });

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
        $reserved = $service->reservationItems()->whereHas('reservation', fn ($query) => $query->whereIn('status', ['confirmed']))
            ->when(isset($data['check_in']), fn ($query) => $query->whereDate('check_in', '<', $data['check_out'])->whereDate('check_out', '>', $data['check_in']))
            ->when(isset($data['reservation_date']), fn ($query) => $query->whereDate('reservation_date', $data['reservation_date']))
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
}
