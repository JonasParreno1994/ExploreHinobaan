<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

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
        //
    }
}
