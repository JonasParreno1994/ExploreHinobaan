<?php

namespace App\Http\Controllers;

use App\Models\Enterprise;
use App\Models\EnterpriseType;
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

    public function show(Enterprise $enterprise, ReviewPresenter $reviews): Response
    {
        abort_unless($enterprise->application_status === 'approved', 404);
        $enterprise->load([
            'enterpriseType:id,name', 'barangay:id,name', 'galleryImages',
            'services' => fn ($query) => $query->where('status', 'published')->with('serviceType:id,name')->withCount('images'),
        ]);

        return Inertia::render('enterprises/show', ['enterprise' => $enterprise, ...$reviews->for($enterprise)]);
    }
}
