<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Models\Enterprise;
use App\Services\EnterpriseWebsiteAnalytics;
use App\Services\EnterpriseWebsiteManager;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteAnalyticsController extends Controller
{
    public function __invoke(Request $request, Enterprise $enterprise, EnterpriseWebsiteManager $manager, EnterpriseWebsiteAnalytics $analytics): Response
    {
        $website = $manager->getOrCreate($request->user(), $enterprise);
        Gate::authorize('view', $website);
        $now = CarbonImmutable::now();
        $range = $request->string('range', '30days')->toString();
        $from = match ($range) {
            'today' => $now->startOfDay(),
            '7days' => $now->subDays(6)->startOfDay(),
            'month' => $now->startOfMonth(),
            'custom' => CarbonImmutable::parse($request->date('from') ?? $now->subDays(29))->startOfDay(),
            default => $now->subDays(29)->startOfDay(),
        };
        $to = $range === 'custom' ? CarbonImmutable::parse($request->date('to') ?? $now)->endOfDay() : $now->endOfDay();

        return Inertia::render('tourism-enterprise/websites/analytics', [
            'enterprise' => $enterprise->loadMissing('enterpriseType:id,name'),
            'website' => $website,
            'analytics' => $analytics->summarize($enterprise->id, $from, $to),
            'filters' => ['range' => $range, 'from' => $from->toDateString(), 'to' => $to->toDateString()],
        ]);
    }
}
