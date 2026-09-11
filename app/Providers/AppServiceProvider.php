<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Gate::define('manage-footer-settings', fn (User $user): bool => $user->role?->name === 'Administrator');
        Gate::define('manage-site-settings', fn (User $user): bool => $user->role?->name === 'Administrator');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('partner-login', function (Request $request): Limit {
            return Limit::perMinute(5)
                ->by(Str::transliterate(Str::lower($request->string('email'))).'|'.$request->ip())
                ->response(fn (Request $request, array $headers) => back()
                    ->withErrors(['throttle' => 'Too many sign-in attempts. Please wait one minute and try again.'])
                    ->withInput($request->only('email'))
                    ->withHeaders($headers));
        });

        RateLimiter::for('partner-registration', function (Request $request): Limit {
            return Limit::perHour(3)
                ->by($request->ip())
                ->response(fn (Request $request, array $headers) => back()
                    ->withErrors(['throttle' => 'Too many registration attempts. Please wait before submitting another application.'])
                    ->withInput($request->except(['password', 'password_confirmation', 'documents']))
                    ->withHeaders($headers));
        });
    }
}
