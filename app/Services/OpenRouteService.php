<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenRouteService
{
    /**
     * @return array{positions: array<int, array{float, float}>, distance: float, duration: float, steps: array<int, array{instruction: string, distance: float, duration: float}>}
     */
    public function directions(float $originLatitude, float $originLongitude, float $destinationLatitude, float $destinationLongitude, string $travelMode): array
    {
        $response = Http::withToken(config('services.openrouteservice.key'))
            ->withHeaders(['Accept' => 'application/geo+json'])
            ->connectTimeout(3)
            ->timeout(10)
            ->retry([200, 500], throw: false)
            ->post("https://api.openrouteservice.org/v2/directions/{$travelMode}/geojson", [
                'coordinates' => [
                    [$originLongitude, $originLatitude],
                    [$destinationLongitude, $destinationLatitude],
                ],
                'radiuses' => [5000, 5000],
                'instructions' => true,
            ]);

        if ($response->failed() || ! is_array($response->json('features.0.geometry.coordinates'))) {
            throw new RuntimeException('A route could not be calculated at this time.');
        }

        $coordinates = $response->json('features.0.geometry.coordinates');
        $summary = $response->json('features.0.properties.summary', []);
        $steps = $response->json('features.0.properties.segments.0.steps', []);

        return [
            'positions' => collect($coordinates)
                ->map(fn (array $coordinate): array => [(float) $coordinate[1], (float) $coordinate[0]])
                ->values()
                ->all(),
            'distance' => (float) Arr::get($summary, 'distance', 0),
            'duration' => (float) Arr::get($summary, 'duration', 0),
            'steps' => collect($steps)
                ->map(fn (array $step): array => [
                    'instruction' => (string) Arr::get($step, 'instruction', ''),
                    'distance' => (float) Arr::get($step, 'distance', 0),
                    'duration' => (float) Arr::get($step, 'duration', 0),
                ])
                ->filter(fn (array $step): bool => $step['instruction'] !== '')
                ->values()
                ->all(),
        ];
    }
}
