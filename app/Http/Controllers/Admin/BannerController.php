<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBannerRequest;
use App\Http\Requests\Admin\UpdateBannerRequest;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/banners/index', ['banners' => Banner::query()->with('textContent')->latest('id')->paginate(10)]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/banners/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBannerRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('images');
        $data['images'] = $this->storeImages($request->file('images', []));
        $data['sentences'] ??= [];
        Banner::create($data);

        return to_route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner): Response
    {
        return Inertia::render('admin/banners/show', ['banner' => $banner->load('textContent')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner): Response
    {
        return Inertia::render('admin/banners/edit', ['banner' => $banner->load('textContent')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBannerRequest $request, Banner $banner): RedirectResponse
    {
        $data = $request->safe()->except('images');
        $data['images'] = [...$banner->images, ...$this->storeImages($request->file('images', []))];
        $banner->update($data);

        return to_route('admin.banners.index')->with('success', 'Banner updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner): RedirectResponse
    {
        Storage::disk('public')->delete($banner->images);
        $banner->delete();

        return to_route('admin.banners.index')->with('success', 'Banner deleted successfully.');
    }

    /** @param list<UploadedFile> $images @return list<string> */
    private function storeImages(array $images): array
    {
        return collect($images)->map(fn (UploadedFile $image): string => $image->store('banners', 'public'))->all();
    }
}
