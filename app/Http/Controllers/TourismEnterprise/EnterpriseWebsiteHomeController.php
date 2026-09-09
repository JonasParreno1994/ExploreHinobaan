<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\UpdateEnterpriseHomepageSectionsRequest;
use App\Models\Enterprise;
use App\Services\EnterpriseWebsiteManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteHomeController extends Controller
{
    public function edit(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);

        return Inertia::render('tourism-enterprise/websites/home', ['enterprise' => $enterprise, 'website' => $website, 'sections' => $enterprise->sections()->where('section_type', 'like', 'builder_%')->orderBy('sort_order')->get()]);
    }

    public function update(UpdateEnterpriseHomepageSectionsRequest $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        foreach ($request->validated('sections') as $section) {
            $id = $section['id'];
            unset($section['id']);
            $enterprise->sections()->whereKey($id)->where('section_type', 'like', 'builder_%')->update($section);
        }

        return back()->with('success', 'Homepage draft saved.');
    }
}
