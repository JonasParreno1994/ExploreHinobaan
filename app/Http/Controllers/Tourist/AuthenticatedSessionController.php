<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request): Response
    {
        if ($request->filled('redirect') && str_starts_with($request->string('redirect')->toString(), '/')) {
            $request->session()->put('url.intended', $request->string('redirect')->toString());
        }

        return Inertia::render('tourist/login', ['status' => $request->session()->get('status')]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        if (! $request->user()?->isTourist()) {
            Auth::logout();
            throw ValidationException::withMessages(['email' => 'This login is only for registered tourist accounts.']);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('tourist.dashboard', absolute: false));
    }
}
