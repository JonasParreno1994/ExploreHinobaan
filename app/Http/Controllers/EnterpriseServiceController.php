<?php

namespace App\Http\Controllers;

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Services\ReviewPresenter;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseServiceController extends Controller
{
    public function show(Enterprise $enterprise, EnterpriseService $service, ReviewPresenter $reviews): Response
    {
        abort_unless($enterprise->application_status === 'approved' && $service->enterprise_id === $enterprise->id && $service->status === 'published', 404);
        $service->load([
            'serviceType:id,name', 'images', 'sessions' => fn ($query) => $query->where('is_active', true),
            'availabilities' => fn ($query) => $query->whereDate('date', '>=', today())->orderBy('date')->limit(90),
            'reservationItems' => fn ($query) => $query
                ->whereHas('reservation', fn ($reservationQuery) => $reservationQuery->whereIn('status', ['pending', 'confirmed']))
                ->where(fn ($dateQuery) => $dateQuery->whereDate('check_out', '>=', today())->orWhereDate('reservation_date', '>=', today()))
                ->select(['id', 'enterprise_service_id', 'service_session_id', 'quantity', 'check_in', 'check_out', 'reservation_date', 'start_time', 'end_time']),
        ]);

        return Inertia::render('enterprises/services/show', [
            'enterprise' => $enterprise->load(['enterpriseType:id,name', 'barangay:id,name']),
            'service' => $service,
            ...$reviews->for($service),
        ]);
    }
}
