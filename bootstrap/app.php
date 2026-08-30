<?php

use App\Http\Middleware\EnsureEnterpriseCanReportArrivals;
use App\Http\Middleware\EnsureEnterpriseIsLocalProductSeller;
use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RecordUserActivity;
use App\Services\Security\SecurityEventRecorder;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
            'arrival-reporting' => EnsureEnterpriseCanReportArrivals::class,
            'local-product-seller' => EnsureEnterpriseIsLocalProductSeller::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            RecordUserActivity::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthorizationException $exception, Request $request) {
            if ($request->user()) {
                app(SecurityEventRecorder::class)->record($request, 'authorization_violation', 'denied', $request->route()?->getName(), ['response_status' => 403]);
            }

            return null;
        });
    })->create();
