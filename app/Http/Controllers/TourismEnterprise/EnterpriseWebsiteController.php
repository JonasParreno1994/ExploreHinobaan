<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\EnterpriseWebsiteTemplate;
use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\UpdateEnterpriseWebsiteAppearanceRequest;
use App\Http\Requests\TourismEnterprise\UpdateEnterpriseWebsiteSeoRequest;
use App\Models\Enterprise;
use App\Models\EnterpriseWebsite;
use App\Services\EnterpriseWebsiteManager;
use App\Services\ReviewPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteController extends Controller
{
    public function index(Request $request): Response
    {
        $enterprises = $request->user()->enterprises()->where('application_status', 'approved')
            ->whereHas('enterpriseType', fn ($query) => $query->where('status', 'active'))
            ->with('microsite')->withCount(['galleryImages', 'sections'])->latest('id')->get();

        return Inertia::render('tourism-enterprise/websites/index', ['enterprises' => $enterprises]);
    }

    public function dashboard(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('view', $website);

        return Inertia::render('tourism-enterprise/websites/dashboard', $this->websiteProps($enterprise, $website));
    }

    public function appearance(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);

        return Inertia::render('tourism-enterprise/websites/appearance', [
            ...$this->websiteProps($enterprise, $website),
            'templates' => collect(EnterpriseWebsiteTemplate::cases())->map(fn ($template): array => ['value' => $template->value, 'label' => $template->label()]),
        ]);
    }

    public function updateAppearance(UpdateEnterpriseWebsiteAppearanceRequest $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        $data = $request->safe()->except(['logo', 'cover_image', 'remove_logo', 'remove_cover_image']);

        foreach (['logo', 'cover_image'] as $field) {
            if ($request->boolean('remove_'.$field) || $request->hasFile($field)) {
                if ($website->{$field}) {
                    Storage::disk('public')->delete($website->{$field});
                }
                $data[$field] = null;
            }
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('enterprise-websites/'.$enterprise->id, 'public');
            }
        }

        $website->update($data);

        return back()->with('success', 'Website appearance updated.');
    }

    public function seo(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);

        return Inertia::render('tourism-enterprise/websites/seo', $this->websiteProps($enterprise, $website));
    }

    public function updateSeo(UpdateEnterpriseWebsiteSeoRequest $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        $data = $request->safe()->except(['social_image', 'remove_social_image']);
        if ($request->boolean('remove_social_image') || $request->hasFile('social_image')) {
            if ($website->social_image) {
                Storage::disk('public')->delete($website->social_image);
            }
            $data['social_image'] = null;
        }
        if ($request->hasFile('social_image')) {
            $data['social_image'] = $request->file('social_image')->store('enterprise-websites/'.$enterprise->id, 'public');
        }
        $website->update($data);

        return back()->with('success', 'SEO and sharing settings updated.');
    }

    public function publish(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('publish', $website);
        $request->validate(['is_published' => ['required', 'boolean']]);
        $published = $request->boolean('is_published');
        $website->update([
            'is_published' => $published,
            'published_at' => $published ? now() : null,
            'published_snapshot' => $published ? [
                'website' => $website->only(['template', 'logo', 'cover_image', 'tagline', 'primary_color', 'secondary_color', 'accent_color', 'seo_title', 'seo_description', 'social_title', 'social_description', 'social_image']),
                'sections' => $enterprise->sections()->orderBy('sort_order')->get(['section_type', 'title', 'subtitle', 'content', 'is_visible', 'sort_order', 'settings'])->toArray(),
            ] : $website->published_snapshot,
        ]);

        return back()->with('success', $published ? 'Website published.' : 'Website returned to draft.');
    }

    public function preview(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager, ReviewPresenter $reviews): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('view', $website);
        $enterprise->load(['enterpriseType:id,name', 'barangay:id,name', 'microsite', 'sections' => fn ($query) => $query->where('is_visible', true), 'socialLinks', 'galleryImages', 'services' => fn ($query) => $query->where('status', 'published')->with('serviceType:id,name')->withCount('images'), 'menuCategories' => fn ($query) => $query->where('is_active', true)->with(['items' => fn ($items) => $items->where('is_available', true)]), 'tourPackages' => fn ($query) => $query->where('is_available', true)->with('itineraries'), 'guideSpecializations' => fn ($query) => $query->where('is_active', true), 'localProducts' => fn ($query) => $query->where('status', 'published')->with('category:id,name')->latest('id')]);

        return Inertia::render('enterprises/show', ['enterprise' => $enterprise, 'isPreview' => true, ...$reviews->for($enterprise)]);
    }

    private function websiteProps(Enterprise $enterprise, EnterpriseWebsite $website): array
    {
        return [
            'enterprise' => $enterprise->loadMissing('enterpriseType:id,name'),
            'website' => $website,
            'completionPercentage' => $website->completionPercentage(),
            'publicUrl' => route('enterprises.show', $enterprise->slug),
        ];
    }
}
