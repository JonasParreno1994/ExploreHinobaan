<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\ReservationItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $enterprises = $request->user()->enterprises()
            ->with(['enterpriseType:id,name', 'barangay:id,name'])
            ->withCount([
                'documents',
                'documents as verified_documents_count' => fn ($query) => $query->where('verification_status', 'verified'),
            ])
            ->latest('id')
            ->get();

        $enterpriseIds = $enterprises->pluck('id');
        $reservations = Reservation::query()->whereIn('enterprise_id', $enterpriseIds);
        $reservationCounts = (clone $reservations)->selectRaw('status, count(*) as aggregate')->groupBy('status')->pluck('aggregate', 'status');
        $accommodatedStatuses = ['confirmed', 'completed'];
        $monthlyReservations = (clone $reservations)
            ->select(['id', 'created_at'])
            ->where('created_at', '>=', now()->startOfMonth()->subMonths(5))
            ->get()
            ->groupBy(fn (Reservation $reservation): string => $reservation->created_at->format('Y-m'));

        return Inertia::render('tourism-enterprise/dashboard', [
            'enterprises' => $enterprises,
            'statistics' => [
                'enterprises' => $enterprises->count(),
                'approved' => $enterprises->where('application_status', 'approved')->count(),
                'pending' => $enterprises->where('application_status', 'pending')->count(),
                'documents' => $enterprises->sum('documents_count'),
                'reservations' => (clone $reservations)->count(),
                'pending_reservations' => (int) ($reservationCounts['pending'] ?? 0),
                'confirmed_reservations' => (int) ($reservationCounts['confirmed'] ?? 0),
                'completed_reservations' => (int) ($reservationCounts['completed'] ?? 0),
                'accommodated_guests' => (int) ReservationItem::query()
                    ->whereHas('reservation', fn ($query) => $query->whereIn('enterprise_id', $enterpriseIds)->whereIn('status', $accommodatedStatuses))
                    ->sum('number_of_guests'),
                'confirmed_revenue' => (float) (clone $reservations)->whereIn('status', $accommodatedStatuses)->sum('total_amount'),
            ],
            'reservationTrend' => collect(range(5, 0))->map(function (int $monthsAgo) use ($monthlyReservations): array {
                $month = now()->startOfMonth()->subMonths($monthsAgo);

                return ['label' => $month->format('M'), 'value' => $monthlyReservations->get($month->format('Y-m'), collect())->count()];
            }),
            'recentReservations' => (clone $reservations)
                ->with(['enterprise:id,business_name', 'items.service:id,name'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
