<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\StoreEnterpriseTourItineraryRequest;
use App\Http\Requests\TourismEnterprise\StoreEnterpriseTourPackageRequest;
use App\Models\Enterprise;
use App\Models\EnterpriseTourItinerary;
use App\Models\EnterpriseTourPackage;
use App\Services\EnterpriseWebsiteManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteTourController extends Controller
{
    public function index(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        abort_unless(in_array($enterprise->enterpriseType?->name, ['Tour Guide', 'Tour Operator'], true), 404);

        return Inertia::render('tourism-enterprise/websites/tours', ['enterprise' => $enterprise, 'website' => $website, 'packages' => $enterprise->tourPackages()->with('itineraries')->get()]);
    }

    public function storePackage(StoreEnterpriseTourPackageRequest $request, Enterprise $enterprise): RedirectResponse
    {
        $data = $request->safe()->except('image');
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('enterprise-tours/'.$enterprise->id, 'public');
        }
        $enterprise->tourPackages()->create($data);

        return back()->with('success', 'Tour package created.');
    }

    public function storeItinerary(StoreEnterpriseTourItineraryRequest $request, Enterprise $enterprise): RedirectResponse
    {
        EnterpriseTourPackage::query()->whereBelongsTo($enterprise)->findOrFail($request->integer('enterprise_tour_package_id'))->itineraries()->create($request->safe()->except('enterprise_tour_package_id'));

        return back()->with('success', 'Itinerary item added.');
    }

    public function destroyItinerary(Request $request, Enterprise $enterprise, EnterpriseTourItinerary $itinerary): RedirectResponse
    {
        abort_unless($enterprise->user_id === $request->user()->id && $itinerary->package()->whereBelongsTo($enterprise)->exists(), 403);
        $itinerary->delete();

        return back()->with('success', 'Itinerary item removed.');
    }
}
