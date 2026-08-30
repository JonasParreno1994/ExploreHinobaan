<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\StoreLocalProductRequest;
use App\Models\LocalProduct;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LocalProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = LocalProduct::query()->whereHas('enterprise', fn ($query) => $query->where('user_id', $request->user()->id))
            ->with(['enterprise:id,business_name', 'category:id,name'])->latest()->paginate(15);

        return Inertia::render('tourism-enterprise/products/index', ['products' => $products]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('tourism-enterprise/products/create', $this->formData($request));
    }

    public function store(StoreLocalProductRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['main_image', 'gallery_images']);
        $data['slug'] = $this->uniqueSlug($data['name']);
        $data['status'] = 'pending_review';
        $data['main_image'] = $request->file('main_image')?->store('local-products/main', 'public');
        $product = LocalProduct::create($data);
        foreach ($request->file('gallery_images', []) as $index => $image) {
            $product->images()->create(['image_path' => $image->store('local-products/gallery', 'public'), 'sort_order' => $index]);
        }

        return to_route('partner.products.index')->with('success', 'Product submitted for administrator review.');
    }

    public function show(string $id): void {}

    public function edit(Request $request, LocalProduct $product): Response
    {
        $this->authorizeOwner($request, $product);

        return Inertia::render('tourism-enterprise/products/edit', [...$this->formData($request), 'product' => $product->load('images')]);
    }

    public function update(StoreLocalProductRequest $request, LocalProduct $product): RedirectResponse
    {
        $this->authorizeOwner($request, $product);
        $data = $request->safe()->except(['main_image', 'gallery_images']);
        if ($request->hasFile('main_image')) {
            $data['main_image'] = $request->file('main_image')->store('local-products/main', 'public');
        }
        $product->update([...$data, 'status' => 'pending_review', 'rejection_reason' => null]);
        foreach ($request->file('gallery_images', []) as $index => $image) {
            $product->images()->create(['image_path' => $image->store('local-products/gallery', 'public'), 'sort_order' => $product->images()->count() + $index]);
        }

        return to_route('partner.products.index')->with('success', 'Product changes submitted for review.');
    }

    public function destroy(Request $request, LocalProduct $product): RedirectResponse
    {
        $this->authorizeOwner($request, $product);
        $product->update(['status' => 'archived']);

        return back()->with('success', 'Product archived.');
    }

    private function formData(Request $request): array
    {
        return ['enterprises' => $request->user()->enterprises()->where('application_status', 'approved')->get(['id', 'business_name']), 'categories' => ProductCategory::query()->where('status', 'active')->orderBy('name')->get(['id', 'name'])];
    }

    private function authorizeOwner(Request $request, LocalProduct $product): void
    {
        abort_unless($product->enterprise()->where('user_id', $request->user()->id)->exists(), 403);
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'local-product';
        $slug = $base;
        $suffix = 2;
        while (LocalProduct::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }
}
