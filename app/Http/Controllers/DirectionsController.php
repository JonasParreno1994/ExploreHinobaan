<?php

namespace App\Http\Controllers;

use App\Http\Requests\DirectionsRequest;
use App\Services\OpenRouteService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class DirectionsController extends Controller
{
    public function __invoke(DirectionsRequest $request, OpenRouteService $openRouteService): JsonResponse
    {
        if (! config('services.openrouteservice.key')) {
            return response()->json(['message' => 'In-app directions are not configured yet.'], 503);
        }

        $coordinates = $request->safe()->only([
            'origin_latitude',
            'origin_longitude',
            'destination_latitude',
            'destination_longitude',
            'travel_mode',
        ]);

        try {
            return response()->json($openRouteService->directions(
                (float) $coordinates['origin_latitude'],
                (float) $coordinates['origin_longitude'],
                (float) $coordinates['destination_latitude'],
                (float) $coordinates['destination_longitude'],
                $coordinates['travel_mode'],
            ));
        } catch (ConnectionException|RuntimeException) {
            return response()->json(['message' => 'A route could not be calculated. Open Google Maps to continue.'], 502);
        }
    }
}
