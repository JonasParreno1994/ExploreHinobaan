<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tourist\RegisterTouristRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredTouristController extends Controller
{
    public function create(Request $request): Response
    {
        if ($request->filled('redirect') && str_starts_with($request->string('redirect')->toString(), '/')) {
            $request->session()->put('url.intended', $request->string('redirect')->toString());
        }

        return Inertia::render('tourist/register');
    }

    public function store(RegisterTouristRequest $request): RedirectResponse
    {
        $user = User::create([
            ...$request->safe()->except(['password_confirmation']),
            'role_id' => Role::query()->where('name', 'Tourist')->valueOrFail('id'),
        ]);

        event(new Registered($user));
        Auth::login($user);
        $request->session()->regenerate();

        return to_route('verification.notice')->with('status', 'verification-link-sent');
    }
}
