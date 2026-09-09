<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\StoreEnterpriseGuideSpecializationRequest;
use App\Models\Enterprise;
use App\Models\EnterpriseGuideSpecialization;
use App\Services\EnterpriseWebsiteManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteGuideController extends Controller
{
    public function index(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        abort_unless($enterprise->enterpriseType?->name === 'Tour Guide', 404);

        return Inertia::render('tourism-enterprise/websites/guide-specializations', ['enterprise' => $enterprise, 'website' => $website, 'specializations' => $enterprise->guideSpecializations]);
    }

    public function store(StoreEnterpriseGuideSpecializationRequest $request, Enterprise $enterprise): RedirectResponse
    {
        $enterprise->guideSpecializations()->create($request->validated());

        return back()->with('success', 'Guide specialization added.');
    }

    public function destroy(Request $request, Enterprise $enterprise, EnterpriseGuideSpecialization $specialization): RedirectResponse
    {
        abort_unless($enterprise->user_id === $request->user()->id && $specialization->enterprise_id === $enterprise->id, 403);
        $specialization->delete();

        return back()->with('success', 'Guide specialization removed.');
    }
}
