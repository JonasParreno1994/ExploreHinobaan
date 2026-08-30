<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEnterpriseCanReportArrivals
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowed = $request->user()?->enterprises()->where('application_status', 'approved')
            ->whereHas('enterpriseType', fn ($query) => $query->whereIn('slug', ['accommodation', 'resort', 'homestay', 'hotel', 'tour-operator']))->exists();
        abort_unless($allowed, 403);

        return $next($request);
    }
}
