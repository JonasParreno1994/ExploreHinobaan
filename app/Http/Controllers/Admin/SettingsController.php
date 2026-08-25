<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FooterSetting;
use App\Models\HeaderSetting;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __invoke(): Response
    {
        Gate::authorize('manage-site-settings');

        return Inertia::render('admin/settings/index', [
            'headerSetting' => HeaderSetting::query()->latest('id')->first(),
            'footerSetting' => FooterSetting::query()->latest('id')->first(),
        ]);
    }
}
