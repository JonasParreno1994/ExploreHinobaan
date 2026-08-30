<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    use AuthorizesRequests;

    public function dashboard(Request $request): Response
    {
        $user = $request->user()->load('touristVerification');

        return Inertia::render('tourist/dashboard', [
            'summary' => ['total' => $user->reservations()->count(), 'pending' => $user->reservations()->where('status', 'pending')->count(), 'confirmed' => $user->reservations()->where('status', 'confirmed')->count()],
            'verification' => $user->touristVerification,
        ]);
    }

    public function reservations(Request $request): Response
    {
        return Inertia::render('tourist/reservations/index', [
            'reservations' => $request->user()->reservations()->with(['enterprise:id,business_name,slug', 'items.service:id,name,slug,enterprise_id'])->latest()->paginate(12),
        ]);
    }

    public function reservation(Reservation $reservation): Response
    {
        $this->authorize('view', $reservation);

        return Inertia::render('tourist/reservations/show', ['reservation' => $reservation->load(['enterprise:id,business_name,slug', 'items.service:id,name,slug,enterprise_id'])]);
    }

    public function profile(Request $request): Response
    {
        return Inertia::render('tourist/profile', ['tourist' => $request->user()->only(['name', 'email', 'phone', 'country', 'province', 'city_municipality', 'email_verified_at'])]);
    }
}
