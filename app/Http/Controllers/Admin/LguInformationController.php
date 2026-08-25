<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLguInformationRequest;
use App\Http\Requests\Admin\UpdateLguInformationRequest;
use App\Models\LguInformation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;

class LguInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/lgu-information/index', ['entries' => LguInformation::query()->latest('id')->paginate(10)]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/lgu-information/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLguInformationRequest $request): RedirectResponse
    {
        $validated = $request->safe()->except('images');
        $validated['images'] = $this->storeImages($request->file('images', []));
        LguInformation::create($validated);

        return to_route('admin.lgu-information.index')->with('success', 'LGU information created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LguInformation $lguInformation): Response
    {
        return Inertia::render('admin/lgu-information/show', ['entry' => $lguInformation]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LguInformation $lguInformation): Response
    {
        return Inertia::render('admin/lgu-information/edit', ['entry' => $lguInformation]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLguInformationRequest $request, LguInformation $lguInformation): RedirectResponse
    {
        $validated = $request->safe()->except('images');
        $newImages = $this->storeImages($request->file('images', []));
        $validated['images'] = [...$lguInformation->images, ...$newImages];
        $lguInformation->update($validated);

        return to_route('admin.lgu-information.index')->with('success', 'LGU information updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * @param  list<UploadedFile>  $images
     * @return list<string>
     */
    private function storeImages(array $images): array
    {
        return collect($images)->map(fn (UploadedFile $image): string => $image->store('lgu-information', 'public'))->all();
    }
}
