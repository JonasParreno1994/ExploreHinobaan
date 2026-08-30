<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tourist\StoreTouristVerificationRequest;
use App\Models\AuditLog;
use App\Models\TouristVerification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VerificationController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('tourist/verification', [
            'verification' => $request->user()->touristVerification,
            'idTypes' => ['National ID', "Driver's License", 'Passport', 'PRC ID', 'UMID', 'Postal ID', 'Other Government-Issued ID'],
        ]);
    }

    public function store(StoreTouristVerificationRequest $request): RedirectResponse
    {
        $existing = $request->user()->touristVerification;
        abort_if($existing?->verification_status === 'verified', 422, 'This tourist account is already verified.');

        if ($existing) {
            Storage::disk('local')->delete(array_filter([$existing->id_front_path, $existing->id_back_path, $existing->selfie_with_id_path]));
        }

        $verification = TouristVerification::updateOrCreate(['user_id' => $request->user()->id], [
            'id_type' => $request->string('id_type')->toString(),
            'id_front_path' => $request->file('id_front')->store('tourist-verifications', 'local'),
            'id_back_path' => $request->file('id_back')?->store('tourist-verifications', 'local'),
            'selfie_with_id_path' => $request->file('selfie_with_id')->store('tourist-verifications', 'local'),
            'verification_status' => 'pending', 'rejection_reason' => null, 'verified_by' => null, 'verified_at' => null, 'submitted_at' => now(),
        ]);

        AuditLog::create(['user_id' => $request->user()->id, 'actor_name' => $request->user()->name, 'actor_email' => $request->user()->email, 'action' => $existing ? 'tourist_verification_resubmitted' : 'tourist_verification_submitted', 'method' => $request->method(), 'route_name' => $request->route()?->getName(), 'path' => $request->path(), 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(), 'metadata' => ['verification_id' => $verification->id]]);

        return back()->with('success', 'Your identity documents were submitted for administrator review.');
    }
}
