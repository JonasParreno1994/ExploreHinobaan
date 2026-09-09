<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\UpdateEnterpriseWebsiteLocationRequest;
use App\Models\Enterprise;
use App\Services\EnterpriseWebsiteManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteLocationController extends Controller
{
    public function edit(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);

        return Inertia::render('tourism-enterprise/websites/location', ['enterprise' => $enterprise, 'website' => $website]);
    }

    public function update(UpdateEnterpriseWebsiteLocationRequest $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        $enterprise->update($request->validated());

        return back()->with('success', 'Website location updated.');
    }
}
