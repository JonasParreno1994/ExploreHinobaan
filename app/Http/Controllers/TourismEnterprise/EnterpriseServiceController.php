<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\StoreEnterpriseServiceRequest;
use App\Http\Requests\TourismEnterprise\UpdateEnterpriseServiceRequest;
use App\Models\EnterpriseService;
use App\Models\ServiceType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', EnterpriseService::class);
        $services = EnterpriseService::query()->whereHas('enterprise', fn ($query) => $query->where('user_id', $request->user()->id))
            ->with(['enterprise:id,business_name', 'serviceType:id,name'])->withCount('images')->latest()->paginate(12);

        return Inertia::render('tourism-enterprise/services/index', ['services' => $services]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', EnterpriseService::class);

        return Inertia::render('tourism-enterprise/services/create', $this->formOptions($request));
    }

    public function store(StoreEnterpriseServiceRequest $request): RedirectResponse
    {
        $paths = [];
        try {
            DB::transaction(function () use ($request, &$paths): void {
                $data = Arr::except($request->validated(), ['main_image', 'gallery_images']);
                $data['slug'] = $this->uniqueSlug((int) $data['enterprise_id'], $data['name']);
                if ($request->hasFile('main_image')) {
                    $data['main_image'] = $paths[] = $request->file('main_image')->store('enterprise-services', 'public');
                }
                $service = EnterpriseService::create($data);
                foreach ($request->file('gallery_images', []) as $index => $image) {
                    $path = $paths[] = $image->store('enterprise-services/gallery', 'public');
                    $service->images()->create(['image_path' => $path, 'sort_order' => $index]);
                }
            });
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($paths);
            throw $exception;
        }

        return to_route('partner.services.index')->with('success', 'Service created successfully.');
    }

    public function edit(Request $request, EnterpriseService $enterpriseService): Response
    {
        $this->authorize('update', $enterpriseService);

        return Inertia::render('tourism-enterprise/services/edit', [...$this->formOptions($request), 'service' => $enterpriseService->load(['images', 'serviceType'])]);
    }

    public function update(UpdateEnterpriseServiceRequest $request, EnterpriseService $enterpriseService): RedirectResponse
    {
        $data = Arr::except($request->validated(), ['main_image', 'gallery_images']);
        if ($request->hasFile('main_image')) {
            $oldImage = $enterpriseService->main_image;
            $data['main_image'] = $request->file('main_image')->store('enterprise-services', 'public');
            if ($oldImage) {
                Storage::disk('public')->delete($oldImage);
            }
        }
        $enterpriseService->update($data);
        foreach ($request->file('gallery_images', []) as $index => $image) {
            $enterpriseService->images()->create(['image_path' => $image->store('enterprise-services/gallery', 'public'), 'sort_order' => $enterpriseService->images()->count() + $index]);
        }

        return to_route('partner.services.index')->with('success', 'Service updated successfully.');
    }

    public function archive(EnterpriseService $enterpriseService): RedirectResponse
    {
        $this->authorize('delete', $enterpriseService);
        $enterpriseService->update(['status' => 'archived']);

        return back()->with('success', 'Service archived.');
    }

    private function formOptions(Request $request): array
    {
        return [
            'enterprises' => $request->user()->enterprises()->select(['id', 'business_name'])->orderBy('business_name')->get(),
            'serviceTypes' => ServiceType::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ];
    }

    private function uniqueSlug(int $enterpriseId, string $name): string
    {
        $base = Str::slug($name) ?: 'service';
        $slug = $base;
        $suffix = 2;
        while (EnterpriseService::query()->where('enterprise_id', $enterpriseId)->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }
}
