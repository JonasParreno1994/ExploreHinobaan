<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateTouristStatusRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TouristController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->squish()->toString();
        $status = $request->string('status')->toString();
        $emailVerification = $request->string('email_verification')->toString();
        $identityStatus = $request->string('identity_status')->toString();

        $tourists = $this->touristQuery()
            ->select(['id', 'role_id', 'name', 'email', 'phone', 'country', 'province', 'city_municipality', 'status', 'email_verified_at', 'created_at'])
            ->with('touristVerification:id,user_id,verification_status,submitted_at,verified_at')
            ->withCount('reservations')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when(in_array($status, ['active', 'inactive', 'suspended'], true), fn (Builder $query) => $query->where('status', $status))
            ->when($emailVerification === 'verified', fn (Builder $query) => $query->whereNotNull('email_verified_at'))
            ->when($emailVerification === 'unverified', fn (Builder $query) => $query->whereNull('email_verified_at'))
            ->when($identityStatus === 'not_submitted', fn (Builder $query) => $query->whereDoesntHave('touristVerification'))
            ->when(in_array($identityStatus, ['pending', 'verified', 'rejected', 'resubmission_required'], true), function (Builder $query) use ($identityStatus): void {
                $query->whereHas('touristVerification', fn (Builder $verificationQuery) => $verificationQuery->where('verification_status', $identityStatus));
            })
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/tourists/index', [
            'filters' => compact('search', 'status', 'emailVerification', 'identityStatus'),
            'summary' => [
                'total' => $this->touristQuery()->count(),
                'active' => $this->touristQuery()->where('status', 'active')->count(),
                'suspended' => $this->touristQuery()->where('status', 'suspended')->count(),
                'identity_verified' => $this->touristQuery()->whereHas('touristVerification', fn (Builder $query) => $query->where('verification_status', 'verified'))->count(),
                'verification_pending' => $this->touristQuery()->whereHas('touristVerification', fn (Builder $query) => $query->where('verification_status', 'pending'))->count(),
            ],
            'tourists' => $tourists,
        ]);
    }

    public function show(User $tourist): Response
    {
        $this->ensureTourist($tourist);
        $tourist->load(['touristVerification:id,user_id,id_type,verification_status,rejection_reason,submitted_at,verified_at,verified_by']);

        $reservations = $tourist->reservations()
            ->select(['id', 'reservation_number', 'enterprise_id', 'total_amount', 'status', 'created_at'])
            ->with(['enterprise:id,business_name,slug', 'items:id,reservation_id,enterprise_service_id,quantity,number_of_guests,check_in,check_out,reservation_date', 'items.service:id,name,service_type'])
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/tourists/show', [
            'canManageStatus' => request()->user()?->role?->name === 'Administrator',
            'reservations' => $reservations,
            'reservationSummary' => [
                'total' => $tourist->reservations()->count(),
                'pending' => $tourist->reservations()->where('status', 'pending')->count(),
                'confirmed' => $tourist->reservations()->where('status', 'confirmed')->count(),
                'completed' => $tourist->reservations()->where('status', 'completed')->count(),
                'total_spent' => $tourist->reservations()->whereIn('status', ['confirmed', 'completed'])->sum('total_amount'),
            ],
            'tourist' => $tourist->only(['id', 'name', 'email', 'phone', 'country', 'province', 'city_municipality', 'status', 'email_verified_at', 'created_at', 'updated_at']) + [
                'verification' => $tourist->touristVerification,
            ],
        ]);
    }

    public function updateStatus(UpdateTouristStatusRequest $request, User $tourist): RedirectResponse
    {
        $this->ensureTourist($tourist);
        $tourist->update($request->validated());

        if ($tourist->status !== 'active') {
            DB::table((string) config('session.table', 'sessions'))->where('user_id', $tourist->id)->delete();
        }

        return back()->with('success', "{$tourist->name}'s account status was updated.");
    }

    private function touristQuery(): Builder
    {
        return User::query()->whereHas('role', fn (Builder $query) => $query->where('name', 'Tourist'));
    }

    private function ensureTourist(User $user): void
    {
        abort_unless($user->isTourist(), 404);
    }
}
