<?php

namespace App\Http\Controllers;

use App\Models\HeaderSetting;
use Illuminate\Http\JsonResponse;

class WebAppManifestController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $headerSetting = HeaderSetting::query()->where('status', 'active')->latest('id')->first();
        $webappLogoUrl = $headerSetting?->webapp_logo_url;
        $icons = $webappLogoUrl
            ? [
                ['src' => $webappLogoUrl, 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'any'],
                ['src' => $webappLogoUrl, 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'maskable'],
            ]
            : [
                ['src' => asset('icons/icon-192.png'), 'sizes' => '192x192', 'type' => 'image/png', 'purpose' => 'any'],
                ['src' => asset('icons/icon-512.png'), 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'any'],
                ['src' => asset('icons/icon-maskable-192.png'), 'sizes' => '192x192', 'type' => 'image/png', 'purpose' => 'maskable'],
                ['src' => asset('icons/icon-maskable-512.png'), 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'maskable'],
            ];

        return response()->json([
            'name' => $headerSetting?->site_name ?: 'Explore Hinoba-an Tourism Portal',
            'short_name' => $headerSetting?->site_name ?: 'Explore Hinoba-an',
            'description' => $headerSetting?->tagline ?: 'Discover destinations, tourism enterprises, local products, maps, and reservations in Hinoba-an.',
            'id' => '/',
            'start_url' => '/',
            'scope' => '/',
            'display' => 'standalone',
            'orientation' => 'portrait-primary',
            'background_color' => '#FFFBF5',
            'theme_color' => '#F97316',
            'icons' => $icons,
        ], headers: [
            'Content-Type' => 'application/manifest+json',
            'Cache-Control' => 'no-cache, private',
        ]);
    }
}
