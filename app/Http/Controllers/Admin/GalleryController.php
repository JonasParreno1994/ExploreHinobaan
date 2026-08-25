<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryRequest;
use App\Http\Requests\Admin\UpdateGalleryRequest;
use App\Models\Gallery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/gallery/index', ['galleries' => Gallery::query()->latest('id')->paginate(12)]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/gallery/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGalleryRequest $request): RedirectResponse
    {
        Gallery::create([
            'images' => $this->storeImages($request->file('images', [])),
            'status' => $request->validated('status'),
        ]);

        return to_route('admin.gallery.index')->with('success', 'Gallery pictures added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gallery $gallery): Response
    {
        return Inertia::render('admin/gallery/show', ['gallery' => $gallery]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gallery $gallery): Response
    {
        return Inertia::render('admin/gallery/edit', ['gallery' => $gallery]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGalleryRequest $request, Gallery $gallery): RedirectResponse
    {
        $gallery->update([
            'images' => [...$gallery->images, ...$this->storeImages($request->file('images', []))],
            'status' => $request->validated('status'),
        ]);

        return to_route('admin.gallery.index')->with('success', 'Gallery updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gallery $gallery): RedirectResponse
    {
        Storage::disk('public')->delete($gallery->images);
        $gallery->delete();

        return to_route('admin.gallery.index')->with('success', 'Gallery deleted successfully.');
    }

    /** @param list<UploadedFile> $images @return list<string> */
    private function storeImages(array $images): array
    {
        return collect($images)->map(fn (UploadedFile $image): string => $image->store('gallery', 'public'))->all();
    }
}
