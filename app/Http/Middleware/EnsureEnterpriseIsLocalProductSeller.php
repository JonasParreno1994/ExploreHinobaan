<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEnterpriseIsLocalProductSeller
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $isLocalProductSeller = $request->user()?->enterprises()
            ->whereHas('enterpriseType', fn ($query) => $query->whereIn('slug', ['local-product-seller', 'local-product-producer']))
            ->exists();

        abort_unless($isLocalProductSeller, 403);

        return $next($request);
    }
}
