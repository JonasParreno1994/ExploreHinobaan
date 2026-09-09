<?php

namespace App\Http\Middleware;

use App\Models\HeaderSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user()?->loadMissing('role'),
            ],
            'partnerWorkspace' => fn (): ?array => $request->user() && $request->routeIs('partner.*')
                ? [
                    'is_local_product_producer' => $request->user()->enterprises()
                        ->whereHas('enterpriseType', fn ($query) => $query->whereIn('slug', ['local-product-seller', 'local-product-producer']))
                        ->exists()
                        && ! $request->user()->enterprises()
                            ->whereHas('enterpriseType', fn ($query) => $query->whereNotIn('slug', ['local-product-seller', 'local-product-producer']))
                            ->exists(),
                    'can_report_arrivals' => $request->user()->enterprises()->where('application_status', 'approved')
                        ->whereHas('enterpriseType', fn ($query) => $query->whereIn('slug', ['accommodation', 'resort', 'homestay', 'hotel', 'tour-operator']))->exists(),
                ]
                : null,
            'adminNotifications' => fn (): ?array => $request->user() && ($request->routeIs('admin.*') || $request->routeIs('dashboard'))
                ? [
                    'unread_count' => $request->user()->unreadNotifications()->count(),
                    'items' => $request->user()->notifications()->latest()->limit(8)->get()->map(fn ($notification): array => [
                        'id' => $notification->id,
                        'data' => $notification->data,
                        'is_read' => $notification->read_at !== null,
                        'created_at' => $notification->created_at?->diffForHumans(),
                    ]),
                ]
                : null,
            'partnerNotifications' => fn (): ?array => $request->user() && $request->routeIs('partner.*')
                ? [
                    'unread_count' => $request->user()->unreadNotifications()->count(),
                    'items' => $request->user()->notifications()
                        ->latest()
                        ->limit(8)
                        ->get()
                        ->map(fn ($notification): array => [
                            'id' => $notification->id,
                            'data' => $notification->data,
                            'is_read' => $notification->read_at !== null,
                            'created_at' => $notification->created_at?->diffForHumans(),
                        ]),
                ]
                : null,
            'touristNotifications' => fn (): ?array => $request->user()?->isTourist() && $request->routeIs('tourist.*')
                ? [
                    'unread_count' => $request->user()->unreadNotifications()->count(),
                    'items' => $request->user()->notifications()
                        ->latest()
                        ->limit(8)
                        ->get()
                        ->map(fn ($notification): array => [
                            'id' => $notification->id,
                            'data' => $notification->data,
                            'is_read' => $notification->read_at !== null,
                            'created_at' => $notification->created_at?->diffForHumans(),
                        ]),
                ]
                : null,
            'branding' => fn (): ?HeaderSetting => HeaderSetting::query()->where('status', 'active')->latest('id')->first(),
        ]);
    }
}
