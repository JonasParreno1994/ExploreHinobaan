<?php

namespace App\Http\Controllers;

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseServiceController extends Controller
{
    public function show(Enterprise $enterprise, EnterpriseService $service): Response
    {
        abort_unless($enterprise->application_status === 'approved' && $service->enterprise_id === $enterprise->id && $service->status === 'published', 404);
        $service->load([
            'serviceType:id,name', 'images',
            'availabilities' => fn ($query) => $query->whereDate('date', '>=', today())->orderBy('date')->limit(90),
        ]);

        return Inertia::render('enterprises/services/show', [
            'enterprise' => $enterprise->load(['enterpriseType:id,name', 'barangay:id,name']),
            'service' => $service,
        ]);
    }
}
