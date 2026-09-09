<?php

namespace App\Http\Controllers;

use App\Models\Enterprise;
use App\Models\EnterpriseSection;
use App\Models\EnterpriseType;
use App\Models\EnterpriseWebsiteEvent;
use App\Services\ReviewPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseController extends Controller
{
    public function index(Request $request): Response
    {
        $enterprises = Enterprise::query()->where('application_status', 'approved')
            ->with(['enterpriseType:id,name,slug', 'barangay:id,name'])
            ->with(['services' => fn ($query) => $query->where('status', 'published')->select(['id', 'enterprise_id', 'name', 'price', 'pricing_unit'])->limit(4)])
            ->when($request->string('search')->trim()->isNotEmpty(), function ($query) use ($request): void {
                $search = '%'.$request->string('search')->trim().'%';
                $query->where(function ($query) use ($search): void {
                    $query->where('business_name', 'like', $search)
                        ->orWhereHas('enterpriseType', fn ($query) => $query->where('name', 'like', $search))
                        ->orWhereHas('barangay', fn ($query) => $query->where('name', 'like', $search))
                        ->orWhereHas('services', fn ($query) => $query->where('name', 'like', $search));
                });
            })
            ->when($request->integer('type'), fn ($query, $type) => $query->where('enterprise_type_id', $type))
            ->latest('approved_at')->paginate(12)->withQueryString();

        return Inertia::render('enterprises/index', [
            'enterprises' => $enterprises,
            'types' => EnterpriseType::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function show(Request $request, Enterprise $enterprise, ReviewPresenter $reviews): Response
    {
        abort_unless($enterprise->application_status === 'approved', 404);
        $hasWebsiteDraft = $enterprise->microsite()->exists();

        $enterprise->load([
            'enterpriseType:id,name', 'barangay:id,name', 'galleryImages', 'socialLinks',
            'microsite' => fn ($query) => $query->where('is_published', true),
            'sections' => fn ($query) => $query->where('is_visible', true),
            'services' => fn ($query) => $query->where('status', 'published')->with('serviceType:id,name')->withCount('images'),
            'menuCategories' => fn ($query) => $query->where('is_active', true)->with(['items' => fn ($items) => $items->where('is_available', true)]),
            'tourPackages' => fn ($query) => $query->where('is_available', true)->with('itineraries'),
            'guideSpecializations' => fn ($query) => $query->where('is_active', true),
            'localProducts' => fn ($query) => $query->where('status', 'published')->with('category:id,name')->latest('id'),
        ]);

        if (! $enterprise->microsite) {
            $enterprise->setRelation('sections', collect());
            $enterprise->setRelation('socialLinks', collect());
            $enterprise->setRelation('menuCategories', collect());
            $enterprise->setRelation('tourPackages', collect());
            $enterprise->setRelation('guideSpecializations', collect());

            if ($hasWebsiteDraft) {
                $enterprise->setRelation('localProducts', collect());
            }
        } elseif ($enterprise->microsite->published_snapshot) {
            $snapshot = $enterprise->microsite->published_snapshot;
            $enterprise->microsite->forceFill($snapshot['website'] ?? []);
            $enterprise->setRelation('sections', EnterpriseSection::hydrate($snapshot['sections'] ?? [])->where('is_visible', true)->sortBy('sort_order')->values());
        }

        $visitorHash = hash_hmac('sha256', ($request->ip() ?? '').'|'.mb_substr((string) $request->userAgent(), 0, 500), config('app.key'));
        $recentlyViewed = EnterpriseWebsiteEvent::query()->whereBelongsTo($enterprise)
            ->where('event_type', 'profile_view')->where('visitor_hash', $visitorHash)
            ->where('created_at', '>=', now()->subMinutes(30))->exists();
        if (! $recentlyViewed) {
            EnterpriseWebsiteEvent::create(['enterprise_id' => $enterprise->id, 'event_type' => 'profile_view', 'visitor_hash' => $visitorHash]);
        }

        $enterprise->makeHidden(['user_id', 'approved_by', 'rejection_reason', 'license_number', 'gcash_qr_path', 'gcash_qr_url']);

        return Inertia::render('enterprises/show', ['enterprise' => $enterprise, ...$reviews->for($enterprise)]);
    }
}
