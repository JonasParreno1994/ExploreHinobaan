<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBarangayRequest;
use App\Http\Requests\Admin\UpdateBarangayRequest;
use App\Models\Barangay;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BarangayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->squish()->toString();

        return Inertia::render('admin/barangays/index', [
            'barangays' => Barangay::query()
                ->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%")->orWhere('psgc_code', 'like', "%{$search}%")))
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
        return Inertia::render('admin/barangays/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBarangayRequest $request): RedirectResponse
    {
        Barangay::create($request->validated());

        return to_route('admin.barangays.index')->with('success', 'Barangay created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Barangay $barangay): Response
    {
        return Inertia::render('admin/barangays/show', ['barangay' => $barangay]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barangay $barangay): Response
    {
        return Inertia::render('admin/barangays/edit', ['barangay' => $barangay]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayRequest $request, Barangay $barangay): RedirectResponse
    {
        $barangay->update($request->validated());

        return to_route('admin.barangays.index')->with('success', 'Barangay updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function activate(Barangay $barangay): RedirectResponse
    {
        $barangay->update(['status' => 'active']);

        return back()->with('success', 'Barangay activated successfully.');
    }

    public function deactivate(Barangay $barangay): RedirectResponse
    {
        $barangay->update(['status' => 'inactive']);

        return back()->with('success', 'Barangay deactivated successfully.');
    }
}
