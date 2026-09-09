<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\UpdateEnterpriseWebsiteContactRequest;
use App\Models\Enterprise;
use App\Services\EnterpriseWebsiteManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteContactController extends Controller
{
    public function edit(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);

        return Inertia::render('tourism-enterprise/websites/contact', ['enterprise' => $enterprise, 'website' => $website, 'socialLinks' => $enterprise->socialLinks]);
    }

    public function update(UpdateEnterpriseWebsiteContactRequest $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager): RedirectResponse
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('update', $website);
        DB::transaction(function () use ($request, $enterprise): void {
            $enterprise->update($request->safe()->only(['email', 'phone', 'website']));
            $links = collect($request->validated('social_links', []))->filter(fn (array $link): bool => filled($link['url'] ?? null));
            $enterprise->socialLinks()->delete();
            $enterprise->socialLinks()->createMany($links->values()->all());
        });

        return back()->with('success', 'Contact and social links updated.');
    }
}
