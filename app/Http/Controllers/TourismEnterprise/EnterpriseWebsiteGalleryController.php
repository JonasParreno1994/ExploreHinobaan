<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\StoreEnterpriseWebsiteGalleryImageRequest;
use App\Models\Enterprise;
use App\Models\EnterpriseGalleryImage;
use App\Services\EnterpriseWebsiteManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteGalleryController extends Controller
{
    public function index(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);

        return Inertia::render('tourism-enterprise/websites/gallery', ['enterprise' => $enterprise, 'website' => $website, 'images' => $enterprise->galleryImages]);
    }

    public function store(StoreEnterpriseWebsiteGalleryImageRequest $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        $enterprise->galleryImages()->create([
            'image_path' => $request->file('image')->store('enterprise-gallery/'.$enterprise->id, 'public'),
            'caption' => $request->validated('caption'),
            'sort_order' => ((int) $enterprise->galleryImages()->max('sort_order')) + 1,
        ]);

        return back()->with('success', 'Gallery image added.');
    }

    public function destroy(Request $request, Enterprise $enterprise, EnterpriseGalleryImage $image, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        abort_unless($image->enterprise_id === $enterprise->id, 404);

        if ($website->cover_image === $image->image_path) {
            $website->update(['cover_image' => null]);
        }

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Gallery image removed.');
    }

    public function reorder(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        $data = $request->validate(['images' => ['required', 'array'], 'images.*' => ['integer']]);
        foreach (array_values($data['images']) as $order => $id) {
            $enterprise->galleryImages()->whereKey($id)->update(['sort_order' => ($order + 1) * 10]);
        }

        return back()->with('success', 'Media order updated.');
    }

    public function feature(Request $request, Enterprise $enterprise, EnterpriseGalleryImage $image, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        abort_unless($image->enterprise_id === $enterprise->id, 404);
        $enterprise->galleryImages()->update(['is_featured' => false]);
        $image->update(['is_featured' => true]);

        return back()->with('success', 'Featured image updated.');
    }

    public function cover(Request $request, Enterprise $enterprise, EnterpriseGalleryImage $image, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        abort_unless($image->enterprise_id === $enterprise->id, 404);
        $website->update(['cover_image' => $image->image_path]);

        return back()->with('success', 'Draft cover image updated.');
    }
}
