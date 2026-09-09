<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\StoreEnterpriseMenuCategoryRequest;
use App\Http\Requests\TourismEnterprise\StoreEnterpriseMenuItemRequest;
use App\Models\Enterprise;
use App\Models\EnterpriseMenuCategory;
use App\Models\EnterpriseMenuItem;
use App\Services\EnterpriseWebsiteManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteMenuController extends Controller
{
    public function index(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        abort_unless(in_array($enterprise->enterpriseType?->name, ['Cafe', 'Restaurant'], true), 404);

        return Inertia::render('tourism-enterprise/websites/menu', [
            'enterprise' => $enterprise,
            'website' => $website,
            'categories' => $enterprise->menuCategories()->with('items')->get(),
        ]);
    }

    public function storeCategory(StoreEnterpriseMenuCategoryRequest $request, Enterprise $enterprise): RedirectResponse
    {
        $enterprise->menuCategories()->create($request->validated());

        return back()->with('success', 'Menu category created.');
    }

    public function storeItem(StoreEnterpriseMenuItemRequest $request, Enterprise $enterprise): RedirectResponse
    {
        $data = $request->safe()->except('image');
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('enterprise-menus/'.$enterprise->id, 'public');
        }
        $enterprise->menuItems()->create($data);

        return back()->with('success', 'Menu item created.');
    }

    public function destroyCategory(Request $request, Enterprise $enterprise, EnterpriseMenuCategory $category): RedirectResponse
    {
        $this->authorizeRecord($request, $enterprise, $category->enterprise_id);
        $category->delete();

        return back()->with('success', 'Menu category removed.');
    }

    public function destroyItem(Request $request, Enterprise $enterprise, EnterpriseMenuItem $item): RedirectResponse
    {
        $this->authorizeRecord($request, $enterprise, $item->enterprise_id);
        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }
        $item->delete();

        return back()->with('success', 'Menu item removed.');
    }

    private function authorizeRecord(Request $request, Enterprise $enterprise, int $recordEnterpriseId): void
    {
        abort_unless($enterprise->user_id === $request->user()->id && $enterprise->id === $recordEnterpriseId, 403);
        abort_unless(in_array($enterprise->enterpriseType?->name, ['Cafe', 'Restaurant'], true), 404);
    }
}
