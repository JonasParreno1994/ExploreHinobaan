<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHeaderSettingRequest;
use App\Http\Requests\Admin\UpdateHeaderSettingRequest;
use App\Models\HeaderSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeaderSettingController extends Controller
{
    public function create(): Response
    {
        Gate::authorize('manage-site-settings');

        return Inertia::render('admin/header-settings/create');
    }

    public function store(StoreHeaderSettingRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['logo', 'remove_logo']);

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('header-logos', 'public');
        }

        HeaderSetting::create($data);

        return to_route('admin.settings')->with('success', 'Header configuration created successfully.');
    }

    public function edit(HeaderSetting $headerSetting): Response
    {
        Gate::authorize('manage-site-settings');

        return Inertia::render('admin/header-settings/edit', ['headerSetting' => $headerSetting]);
    }

    public function update(UpdateHeaderSettingRequest $request, HeaderSetting $headerSetting): RedirectResponse
    {
        $data = $request->safe()->except(['logo', 'remove_logo']);

        if ($request->boolean('remove_logo') || $request->hasFile('logo')) {
            if ($headerSetting->logo_path) {
                Storage::disk('public')->delete($headerSetting->logo_path);
            }

            $data['logo_path'] = null;
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('header-logos', 'public');
        }

        $headerSetting->update($data);

        return to_route('admin.settings')->with('success', 'Header configuration updated successfully.');
    }
}
