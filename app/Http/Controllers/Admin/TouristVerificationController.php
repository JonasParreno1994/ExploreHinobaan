<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateTouristVerificationRequest;
use App\Models\AuditLog;
use App\Models\TouristVerification;
use App\Notifications\TouristVerificationStatusNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TouristVerificationController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $verifications = TouristVerification::query()->with('user:id,name,email,phone,country,province,city_municipality')->when($status, fn ($query) => $query->where('verification_status', $status))->latest('submitted_at')->paginate(15)->withQueryString();

        return Inertia::render('admin/tourist-verifications/index', ['verifications' => $verifications, 'filters' => ['status' => $status]]);
    }

    public function show(Request $request, TouristVerification $touristVerification): Response
    {
        AuditLog::create(['user_id' => $request->user()->id, 'actor_name' => $request->user()->name, 'actor_email' => $request->user()->email, 'action' => 'tourist_verification_viewed', 'method' => $request->method(), 'route_name' => $request->route()?->getName(), 'path' => $request->path(), 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(), 'metadata' => ['verification_id' => $touristVerification->id]]);

        return Inertia::render('admin/tourist-verifications/show', ['verification' => $touristVerification->load('user:id,name,email,phone,country,province,city_municipality')]);
    }

    public function document(TouristVerification $touristVerification, string $document): StreamedResponse
    {
        $path = match ($document) {
            'front' => $touristVerification->id_front_path, 'back' => $touristVerification->id_back_path, 'selfie' => $touristVerification->selfie_with_id_path, default => null
        };
        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path, null, ['Cache-Control' => 'no-store, private']);
    }

    public function update(UpdateTouristVerificationRequest $request, TouristVerification $touristVerification): RedirectResponse
    {
        $data = $request->validated();
        $touristVerification->update(['verification_status' => $data['verification_status'], 'rejection_reason' => $data['verification_status'] === 'verified' ? null : $data['rejection_reason'], 'verified_by' => $data['verification_status'] === 'verified' ? $request->user()->id : null, 'verified_at' => $data['verification_status'] === 'verified' ? now() : null]);

        AuditLog::create(['user_id' => $request->user()->id, 'actor_name' => $request->user()->name, 'actor_email' => $request->user()->email, 'action' => 'tourist_verification_'.$data['verification_status'], 'method' => $request->method(), 'route_name' => $request->route()?->getName(), 'path' => $request->path(), 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(), 'metadata' => ['verification_id' => $touristVerification->id]]);

        $touristVerification->user->notify((new TouristVerificationStatusNotification($touristVerification->refresh()))->afterCommit());

        return to_route('admin.tourist-verifications.show', $touristVerification)->with('success', 'Tourist verification status updated.');
    }
}
