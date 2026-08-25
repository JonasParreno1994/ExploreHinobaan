<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function show(Destination $destination): Response
    {
        abort_unless($destination->status === 'published', 404);

        $destination->load([
            'category:id,name,slug',
            'barangay:id,name',
            'images:id,destination_id,image_path,caption,sort_order,is_primary',
        ]);

        $relatedDestinations = Destination::query()
            ->select(['id', 'category_id', 'barangay_id', 'name', 'slug', 'short_description', 'featured_image'])
            ->with(['category:id,name', 'barangay:id,name'])
            ->where('status', 'published')
            ->whereKeyNot($destination->getKey())
            ->orderByRaw(
                'CASE WHEN category_id = ? THEN 0 WHEN barangay_id = ? THEN 1 ELSE 2 END',
                [$destination->category_id, $destination->barangay_id],
            )
            ->latest('id')
            ->limit(3)
            ->get();

        $destination->increment('views');

        return Inertia::render('destinations/show', [
            'destination' => $destination,
            'relatedDestinations' => $relatedDestinations,
        ]);
    }
}
