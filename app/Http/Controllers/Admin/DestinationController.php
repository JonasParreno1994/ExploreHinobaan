<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderDestinationImagesRequest;
use App\Http\Requests\Admin\StoreDestinationRequest;
use App\Http\Requests\Admin\UpdateDestinationRequest;
use App\Models\Barangay;
use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\TourismCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DestinationController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->squish()->toString(),
            'category' => $request->string('category')->toString(),
            'barangay' => $request->string('barangay')->toString(),
            'status' => $request->string('status')->toString(),
        ];

        $destinations = Destination::query()
            ->select(['id', 'category_id', 'barangay_id', 'name', 'slug', 'short_description', 'address', 'featured_image', 'status', 'is_featured', 'views', 'updated_at'])
            ->with(['category:id,name', 'barangay:id,name'])
            ->when($filters['search'] !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query
                ->whereLike('name', "%{$filters['search']}%")
                ->orWhereLike('address', "%{$filters['search']}%")))
            ->when($filters['category'] !== '', fn (Builder $query): Builder => $query->where('category_id', $filters['category']))
            ->when($filters['barangay'] !== '', fn (Builder $query): Builder => $query->where('barangay_id', $filters['barangay']))
            ->when($filters['status'] !== '', fn (Builder $query): Builder => $query->where('status', $filters['status']))
            ->latest('id')->paginate(10)->withQueryString();

        return Inertia::render('admin/destinations/index', [
            'destinations' => $destinations,
            'categories' => TourismCategory::query()->orderBy('name')->get(['id', 'name']),
            'barangays' => Barangay::query()->orderBy('name')->get(['id', 'name']),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/destinations/create', $this->formOptions());
    }

    public function store(StoreDestinationRequest $request): RedirectResponse
    {
        $storedPaths = [];
        try {
            $featuredImage = $request->file('featured_image')?->store('destinations/featured', 'public');
            $galleryPaths = $this->storeGalleryImages($request->file('gallery_images', []));
            $storedPaths = array_values(array_filter([$featuredImage, ...$galleryPaths]));
            DB::transaction(function () use ($request, $featuredImage, $galleryPaths): void {
                $data = $request->safe()->except(['featured_image', 'gallery_images']);
                $data['featured_image'] = $featuredImage;
                $data['created_by'] = $request->user()->getKey();
                $destination = Destination::create($data);
                $this->createGalleryRecords($destination, $galleryPaths);
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedPaths);
            throw $exception;
        }

        return to_route('admin.destinations.index')->with('success', 'Destination created successfully.');
    }

    public function show(Destination $destination): Response
    {
        $destination->load(['category:id,name', 'barangay:id,name', 'creator:id,name', 'images']);

        return Inertia::render('admin/destinations/show', ['destination' => $destination]);
    }

    public function edit(Destination $destination): Response
    {
        $destination->load('images');

        return Inertia::render('admin/destinations/edit', ['destination' => $destination, ...$this->formOptions()]);
    }

    public function update(UpdateDestinationRequest $request, Destination $destination): RedirectResponse
    {
        $newPaths = [];
        $oldFeaturedImage = $destination->featured_image;
        try {
            $featuredImage = $request->file('featured_image')?->store('destinations/featured', 'public');
            $galleryPaths = $this->storeGalleryImages($request->file('gallery_images', []));
            $newPaths = array_values(array_filter([$featuredImage, ...$galleryPaths]));
            DB::transaction(function () use ($request, $destination, $featuredImage, $galleryPaths): void {
                $data = $request->safe()->except(['featured_image', 'gallery_images']);
                if ($featuredImage !== null) {
                    $data['featured_image'] = $featuredImage;
                }
                $destination->update($data);
                $this->createGalleryRecords($destination, $galleryPaths);
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($newPaths);
            throw $exception;
        }
        if ($featuredImage !== null && $oldFeaturedImage !== null) {
            Storage::disk('public')->delete($oldFeaturedImage);
        }

        return to_route('admin.destinations.show', $destination)->with('success', 'Destination updated successfully.');
    }

    public function publish(Destination $destination): RedirectResponse
    {
        $destination->update(['status' => 'published']);

        return back()->with('success', 'Destination published successfully.');
    }

    public function unpublish(Destination $destination): RedirectResponse
    {
        $destination->update(['status' => 'draft']);

        return back()->with('success', 'Destination returned to draft.');
    }

    public function archive(Destination $destination): RedirectResponse
    {
        $destination->update(['status' => 'archived', 'is_featured' => false]);

        return back()->with('success', 'Destination archived successfully.');
    }

    public function toggleFeatured(Destination $destination): RedirectResponse
    {
        $destination->update(['is_featured' => ! $destination->is_featured]);

        return back()->with('success', $destination->is_featured ? 'Destination featured successfully.' : 'Destination removed from featured.');
    }

    public function destroyImage(Destination $destination, DestinationImage $image): RedirectResponse
    {
        abort_unless($image->destination_id === $destination->id, 404);
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Gallery image deleted successfully.');
    }

    public function reorderImages(ReorderDestinationImagesRequest $request, Destination $destination): RedirectResponse
    {
        $imageIds = $request->validated('image_ids');
        if (count($imageIds) !== $destination->images()->count()) {
            throw ValidationException::withMessages(['image_ids' => 'Every gallery image must be included when reordering.']);
        }
        DB::transaction(function () use ($destination, $imageIds): void {
            foreach ($imageIds as $sortOrder => $imageId) {
                DestinationImage::query()->whereBelongsTo($destination)->whereKey($imageId)->update(['sort_order' => $sortOrder]);
            }
        });

        return back()->with('success', 'Gallery images reordered successfully.');
    }

    /** @return array{categories: mixed, barangays: mixed} */
    private function formOptions(): array
    {
        return [
            'categories' => TourismCategory::query()->orderBy('name')->get(['id', 'name', 'status']),
            'barangays' => Barangay::query()->orderBy('name')->get(['id', 'name', 'status']),
        ];
    }

    /** @param list<UploadedFile> $images @return list<string> */
    private function storeGalleryImages(array $images): array
    {
        return collect($images)->map(fn (UploadedFile $image): string => $image->store('destinations/gallery', 'public'))->all();
    }

    /** @param list<string> $paths */
    private function createGalleryRecords(Destination $destination, array $paths): void
    {
        $nextSortOrder = (int) $destination->images()->max('sort_order') + 1;
        $hasPrimaryImage = $destination->images()->where('is_primary', true)->exists();
        foreach ($paths as $index => $path) {
            $destination->images()->create([
                'image_path' => $path,
                'sort_order' => $nextSortOrder + $index,
                'is_primary' => ! $hasPrimaryImage && $index === 0,
            ]);
        }
    }
}
