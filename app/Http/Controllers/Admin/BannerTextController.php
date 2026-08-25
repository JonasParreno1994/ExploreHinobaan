<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateBannerTextRequest;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BannerTextController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/banner-texts/index', [
            'banners' => Banner::query()->with('textContent')->latest('id')->paginate(10),
        ]);
    }

    public function edit(Banner $banner): Response
    {
        return Inertia::render('admin/banner-texts/edit', [
            'banner' => $banner->load('textContent'),
        ]);
    }

    public function update(UpdateBannerTextRequest $request, Banner $banner): RedirectResponse
    {
        $banner->textContent()->updateOrCreate([], $request->validated());

        return to_route('admin.text.index')->with('success', 'Text updated successfully.');
    }
}
