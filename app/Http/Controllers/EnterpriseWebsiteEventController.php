<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrackEnterpriseWebsiteEventRequest;
use App\Models\Enterprise;
use App\Models\EnterpriseWebsiteEvent;
use Illuminate\Http\Response;

class EnterpriseWebsiteEventController extends Controller
{
    public function store(TrackEnterpriseWebsiteEventRequest $request, Enterprise $enterprise): Response
    {
        abort_unless($enterprise->application_status === 'approved' && $enterprise->microsite()->where('is_published', true)->exists(), 404);

        EnterpriseWebsiteEvent::create([
            'enterprise_id' => $enterprise->id,
            'event_type' => $request->validated('event_type'),
            'visitor_hash' => hash_hmac('sha256', ($request->ip() ?? '').'|'.mb_substr((string) $request->userAgent(), 0, 500), config('app.key')),
            'target_type' => $request->validated('target_type'),
            'target_id' => $request->validated('target_id'),
            'target_label' => $request->validated('target_label'),
        ]);

        return response()->noContent();
    }
}
