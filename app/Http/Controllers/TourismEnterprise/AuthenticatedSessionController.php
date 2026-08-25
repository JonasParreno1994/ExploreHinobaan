<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('tourism-enterprise/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        if ($request->user()?->role?->name !== 'Tourism Enterprise' || ! $request->user()->enterprises()->exists()) {
            Auth::logout();
            throw ValidationException::withMessages(['email' => 'This account is not registered as a tourism enterprise partner.']);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('partner.dashboard', absolute: false));
    }
}
