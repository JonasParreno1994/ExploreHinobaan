<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEnterpriseTypeRequest;
use App\Http\Requests\Admin\UpdateEnterpriseTypeRequest;
use App\Models\EnterpriseType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->squish()->toString();

        return Inertia::render('admin/enterprise-types/index', [
            'enterpriseTypes' => EnterpriseType::query()
                ->withCount('enterprises')
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
        return Inertia::render('admin/enterprise-types/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEnterpriseTypeRequest $request): RedirectResponse
    {
        EnterpriseType::create($request->validated());

        return to_route('admin.enterprise-types.index')->with('success', 'Enterprise type created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EnterpriseType $enterpriseType): Response
    {
        return Inertia::render('admin/enterprise-types/edit', ['enterpriseType' => $enterpriseType]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnterpriseTypeRequest $request, EnterpriseType $enterpriseType): RedirectResponse
    {
        $enterpriseType->update($request->validated());

        return to_route('admin.enterprise-types.index')->with('success', 'Enterprise type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function activate(EnterpriseType $enterpriseType): RedirectResponse
    {
        $enterpriseType->update(['status' => 'active']);

        return back()->with('success', 'Enterprise type activated successfully.');
    }

    public function deactivate(EnterpriseType $enterpriseType): RedirectResponse
    {
        $enterpriseType->update(['status' => 'inactive']);

        return back()->with('success', 'Enterprise type deactivated successfully.');
    }
}
