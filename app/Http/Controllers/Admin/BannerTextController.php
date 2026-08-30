<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateBannerTextRequest;
use App\Models\BannerText;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BannerTextController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/banner-texts/index', [
            'text' => BannerText::query()->latest('id')->first(),
        ]);
    }

    public function update(UpdateBannerTextRequest $request): RedirectResponse
    {
        $text = BannerText::query()->latest('id')->first() ?? new BannerText;
        $text->fill($request->validated())->save();

        return to_route('admin.text.index')->with('success', 'Text updated successfully.');
    }
}
