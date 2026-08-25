<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Barangay;
use App\Models\Destination;
use App\Models\Enterprise;
use App\Models\Event;
use App\Models\FooterSetting;
use App\Models\HeaderSetting;
use App\Models\TourismCategory;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    public function __invoke(): Response
    {
        $heroSlides = Banner::query()
            ->where('status', 'active')
            ->with('textContent')
            ->latest('id')
            ->get()
            ->flatMap(fn (Banner $banner) => collect($banner->image_urls)->map(fn (string $imageUrl, int $index): array => [
                'id' => $banner->id.'-'.$index,
                'image' => $imageUrl,
                'header_1' => $banner->textContent?->header_1,
                'header_2' => $banner->textContent?->header_2,
                'header_3' => $banner->textContent?->header_3,
            ]))
            ->values();

        $destinations = Destination::query()
            ->select(['id', 'category_id', 'barangay_id', 'name', 'slug', 'short_description', 'address', 'latitude', 'longitude', 'featured_image', 'views'])
            ->with(['category:id,name,slug', 'barangay:id,name'])
            ->where('status', 'published')
            ->orderByDesc('is_featured')
            ->latest('id')
            ->limit(6)
            ->get()
            ->map(fn (Destination $destination): array => [
                'id' => $destination->id,
                'name' => $destination->name,
                'slug' => $destination->slug,
                'description' => Str::limit($destination->short_description, 120),
                'address' => $destination->address,
                'latitude' => $destination->latitude,
                'longitude' => $destination->longitude,
                'image' => $destination->featured_image_url,
                'category' => $destination->category?->name,
                'barangay' => $destination->barangay?->name,
                'views' => $destination->views,
            ]);

        $accommodations = Enterprise::query()
            ->select(['id', 'enterprise_type_id', 'barangay_id', 'business_name', 'slug', 'description', 'address', 'latitude', 'longitude', 'cover_image'])
            ->with(['enterpriseType:id,name', 'barangay:id,name'])
            ->where('application_status', 'approved')
            ->whereHas('enterpriseType', fn ($query) => $query->whereIn('name', ['Resort', 'Hotel', 'Homestay']))
            ->latest('approved_at')
            ->limit(3)
            ->get()
            ->map(fn (Enterprise $enterprise): array => [
                'id' => $enterprise->id,
                'name' => $enterprise->business_name,
                'slug' => $enterprise->slug,
                'description' => Str::limit($enterprise->description, 110),
                'address' => $enterprise->address,
                'latitude' => $enterprise->latitude,
                'longitude' => $enterprise->longitude,
                'image' => $enterprise->cover_image_url,
                'type' => $enterprise->enterpriseType?->name,
                'barangay' => $enterprise->barangay?->name,
            ]);

        $events = Event::query()
            ->select(['id', 'barangay_id', 'title', 'slug', 'event_type', 'short_description', 'venue', 'start_date', 'featured_image'])
            ->with('barangay:id,name')
            ->where('status', 'published')
            ->where(fn ($query) => $query->whereNull('start_date')->orWhereDate('start_date', '>=', today()))
            ->orderByRaw('start_date is null')
            ->orderBy('start_date')
            ->limit(3)
            ->get()
            ->map(fn (Event $event): array => [
                'id' => $event->id,
                'title' => $event->title,
                'type' => $event->event_type,
                'description' => Str::limit($event->short_description, 110),
                'venue' => $event->venue,
                'date' => $event->start_date?->format('M d, Y'),
                'day' => $event->start_date?->format('d'),
                'month' => $event->start_date?->format('M'),
                'image' => $event->featured_image_url,
            ]);

        $categories = TourismCategory::query()
            ->select(['id', 'name', 'slug', 'icon'])
            ->withCount(['destinations' => fn ($query) => $query->where('status', 'published')])
            ->where('status', 'active')
            ->orderBy('name')
            ->limit(8)
            ->get();

        $enterprises = Enterprise::query()
            ->select(['id', 'enterprise_type_id', 'barangay_id', 'business_name', 'slug', 'description', 'cover_image', 'logo'])
            ->with(['enterpriseType:id,name', 'barangay:id,name'])
            ->with(['services' => fn ($query) => $query->where('status', 'published')->select(['id', 'enterprise_id', 'name', 'price', 'pricing_unit'])->limit(3)])
            ->where('application_status', 'approved')
            ->latest('approved_at')
            ->limit(6)
            ->get();

        return Inertia::render('welcome', [
            'heroSlides' => $heroSlides,
            'categories' => $categories,
            'destinations' => $destinations,
            'accommodations' => $accommodations,
            'events' => $events,
            'enterprises' => $enterprises,
            'mapLocations' => $destinations->whereNotNull('latitude')->whereNotNull('longitude')->values(),
            'statistics' => [
                'destinations' => Destination::query()->where('status', 'published')->count(),
                'enterprises' => Enterprise::query()->where('application_status', 'approved')->count(),
                'accommodations' => Enterprise::query()->where('application_status', 'approved')->whereHas('enterpriseType', fn ($query) => $query->whereIn('name', ['Resort', 'Hotel', 'Homestay']))->count(),
                'barangays' => Barangay::query()->where('status', 'active')->count(),
            ],
            'footerSetting' => FooterSetting::query()->where('status', 'active')->latest('id')->first(),
            'headerSetting' => HeaderSetting::query()->where('status', 'active')->latest('id')->first(),
        ]);
    }
}
