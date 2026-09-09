<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\UpdateEnterpriseWebsiteSectionRequest;
use App\Models\Enterprise;
use App\Services\EnterpriseWebsiteManager;
use App\Services\EnterpriseWebsiteModuleRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteSectionController extends Controller
{
    public function edit(Request $request, Enterprise $enterprise, string $section, EnterpriseWebsiteManager $manager, EnterpriseWebsiteModuleRegistry $modules): Response
    {
        $availableSections = [...EnterpriseWebsiteManager::SECTIONS, ...$modules->contentSections($enterprise)];
        abort_unless(array_key_exists($section, $availableSections), 404);
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);

        return Inertia::render('tourism-enterprise/websites/section', [
            'enterprise' => $enterprise,
            'website' => $website,
            'section' => $enterprise->sections->firstWhere('section_type', $section),
            'sectionLabel' => $availableSections[$section]['title'],
        ]);
    }

    public function update(UpdateEnterpriseWebsiteSectionRequest $request, Enterprise $enterprise, string $section, EnterpriseWebsiteManager $manager, EnterpriseWebsiteModuleRegistry $modules): RedirectResponse
    {
        $availableSections = [...EnterpriseWebsiteManager::SECTIONS, ...$modules->contentSections($enterprise)];
        abort_unless(array_key_exists($section, $availableSections), 404);
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        $enterprise->sections()->where('section_type', $section)->firstOrFail()->update($request->validated());

        return back()->with('success', $availableSections[$section]['title'].' updated.');
    }
}
