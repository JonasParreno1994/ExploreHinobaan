<?php

namespace App\Http\Controllers;

use App\Models\LocalProduct;
use App\Models\ProductCategory;
use App\Services\ReviewPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocalProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = LocalProduct::query()->where('status', 'published')->whereHas('enterprise', fn ($query) => $query->where('application_status', 'approved'))->with(['enterprise:id,business_name,slug,barangay_id', 'enterprise.barangay:id,name', 'category:id,name'])->when($request->string('search')->toString(), fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'ilike', "%{$search}%")->orWhere('description', 'ilike', "%{$search}%")))->when($request->integer('category'), fn ($query, $category) => $query->where('product_category_id', $category))->orderByDesc('is_featured')->latest()->paginate(12)->withQueryString();

        return Inertia::render('local-products/index', ['products' => $products, 'categories' => ProductCategory::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']), 'filters' => $request->only(['search', 'category'])]);
    }

    public function show(LocalProduct $product, ReviewPresenter $reviews): Response
    {
        abort_unless($product->status === 'published' && $product->enterprise->application_status === 'approved', 404);
        $product->load(['enterprise:id,business_name,slug,address,email,phone,gcash_qr_path', 'category:id,name', 'images']);
        $product->enterprise->append('gcash_qr_url');

        return Inertia::render('local-products/show', ['product' => $product, 'orderSetting' => $product->enterprise->orderSetting()->firstOrCreate([]), ...$reviews->for($product)]);
    }
}
