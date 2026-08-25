<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTourismCategoryRequest;
use App\Http\Requests\Admin\UpdateTourismCategoryRequest;
use App\Models\TourismCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TourismCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->squish()->toString();

        return Inertia::render('admin/categories/index', [
            'categories' => TourismCategory::query()
                ->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query
                    ->whereLike('name', "%{$search}%")
                    ->orWhereLike('description', "%{$search}%")))
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTourismCategoryRequest $request): RedirectResponse
    {
        TourismCategory::create($request->validated());

        return to_route('admin.categories.index')->with('success', 'Tourism category created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TourismCategory $category): Response
    {
        return Inertia::render('admin/categories/edit', ['category' => $category]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTourismCategoryRequest $request, TourismCategory $category): RedirectResponse
    {
        $category->update($request->validated());

        return to_route('admin.categories.index')->with('success', 'Tourism category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function activate(TourismCategory $category): RedirectResponse
    {
        $category->update(['status' => 'active']);

        return back()->with('success', 'Tourism category activated successfully.');
    }

    public function deactivate(TourismCategory $category): RedirectResponse
    {
        $category->update(['status' => 'inactive']);

        return back()->with('success', 'Tourism category deactivated successfully.');
    }
}
