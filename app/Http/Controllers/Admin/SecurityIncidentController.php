<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSecurityIncidentRequest;
use App\Models\SecurityIncident;
use Illuminate\Http\RedirectResponse;

class SecurityIncidentController extends Controller
{
    public function update(UpdateSecurityIncidentRequest $request, SecurityIncident $securityIncident): RedirectResponse
    {
        $status = $request->validated('status');
        $securityIncident->update([
            ...$request->validated(),
            'assigned_to' => $request->user()->id,
            'contained_at' => $status === 'contained' ? now() : $securityIncident->contained_at,
            'resolved_at' => in_array($status, ['resolved', 'false_positive'], true) ? now() : null,
        ]);

        return back()->with('success', 'Security incident updated.');
    }
}
