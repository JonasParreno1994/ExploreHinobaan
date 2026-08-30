<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateWhyVisitSectionRequest;
use App\Models\WhyVisitSection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WhyVisitSectionController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/why-visit/edit', [
            'section' => WhyVisitSection::query()->latest('id')->first() ?? WhyVisitSection::factory()->make(),
        ]);
    }

    public function update(UpdateWhyVisitSectionRequest $request): RedirectResponse
    {
        $section = WhyVisitSection::query()->latest('id')->first() ?? new WhyVisitSection;
        $section->fill($request->validated())->save();

        return back()->with('success', 'Why Visit section updated successfully.');
    }
}
