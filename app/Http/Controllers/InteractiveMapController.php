<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Enterprise;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InteractiveMapController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $destinations = Destination::query()
            ->select(['id', 'category_id', 'barangay_id', 'name', 'slug', 'short_description', 'address', 'contact_number', 'latitude', 'longitude', 'featured_image'])
            ->with(['category:id,name', 'barangay:id,name'])
            ->where('status', 'published')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(fn (Destination $destination): array => [
                'id' => "destination-{$destination->id}",
                'name' => $destination->name,
                'description' => Str::limit($destination->short_description, 130),
                'address' => $destination->address,
                'phone' => $destination->contact_number,
                'latitude' => $destination->latitude,
                'longitude' => $destination->longitude,
                'image' => $destination->featured_image_url,
                'category' => $destination->category?->name ?? 'Destinations',
                'barangay' => $destination->barangay?->name,
                'details_url' => route('destinations.show', $destination->slug),
                'kind' => 'destination',
            ]);

        $enterprises = Enterprise::query()
            ->select(['id', 'enterprise_type_id', 'barangay_id', 'business_name', 'description', 'address', 'phone', 'latitude', 'longitude', 'cover_image'])
            ->with(['enterpriseType:id,name', 'barangay:id,name'])
            ->where('application_status', 'approved')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(fn (Enterprise $enterprise): array => [
                'id' => "enterprise-{$enterprise->id}",
                'name' => $enterprise->business_name,
                'description' => Str::limit($enterprise->description, 130),
                'address' => $enterprise->address,
                'phone' => $enterprise->phone,
                'latitude' => $enterprise->latitude,
                'longitude' => $enterprise->longitude,
                'image' => $enterprise->cover_image_url,
                'category' => $enterprise->enterpriseType?->name ?? 'Tourism Enterprises',
                'barangay' => $enterprise->barangay?->name,
                'details_url' => null,
                'kind' => 'enterprise',
            ]);

        return Inertia::render('interactive-map', [
            'places' => $destinations->concat($enterprises)->values(),
        ]);
    }
}
