<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFooterSettingRequest;
use App\Http\Requests\Admin\UpdateFooterSettingRequest;
use App\Models\FooterSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FooterSettingController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('manage-footer-settings');

        return Inertia::render('admin/footer-settings/index', ['footerSettings' => FooterSetting::query()->latest('id')->paginate(10)]);
    }

    public function create(): Response
    {
        Gate::authorize('manage-footer-settings');

        return Inertia::render('admin/footer-settings/create');
    }

    public function store(StoreFooterSettingRequest $request): RedirectResponse
    {
        FooterSetting::create($request->validated());

        return to_route('admin.footer-settings.index')->with('success', 'Footer configuration created successfully.');
    }

    public function show(FooterSetting $footerSetting): Response
    {
        Gate::authorize('manage-footer-settings');

        return Inertia::render('admin/footer-settings/show', ['footerSetting' => $footerSetting]);
    }

    public function edit(FooterSetting $footerSetting): Response
    {
        Gate::authorize('manage-footer-settings');

        return Inertia::render('admin/footer-settings/edit', ['footerSetting' => $footerSetting]);
    }

    public function update(UpdateFooterSettingRequest $request, FooterSetting $footerSetting): RedirectResponse
    {
        $footerSetting->update($request->validated());

        return to_route('admin.footer-settings.index')->with('success', 'Footer configuration updated successfully.');
    }

    public function destroy(FooterSetting $footerSetting): RedirectResponse
    {
        Gate::authorize('manage-footer-settings');
        $footerSetting->delete();

        return to_route('admin.footer-settings.index')->with('success', 'Footer configuration deleted successfully.');
    }
}
