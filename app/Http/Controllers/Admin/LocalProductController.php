<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LocalProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LocalProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = LocalProduct::query()->with(['enterprise:id,business_name', 'category:id,name'])->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/local-products/index', ['products' => $products, 'filters' => $request->only('status')]);
    }

    public function update(Request $request, LocalProduct $product): RedirectResponse
    {
        $data = $request->validate(['status' => ['required', Rule::in(['published', 'rejected', 'archived'])], 'rejection_reason' => ['nullable', 'required_if:status,rejected', 'string', 'max:2000']]);
        $product->update([...$data, 'approved_at' => $data['status'] === 'published' ? now() : null, 'approved_by' => $data['status'] === 'published' ? $request->user()->id : null]);

        return back()->with('success', 'Product review updated.');
    }

    public function feature(LocalProduct $product): RedirectResponse
    {
        abort_unless($product->status === 'published', 422);
        $product->update(['is_featured' => ! $product->is_featured]);

        return back()->with('success', 'Featured status updated.');
    }
}
