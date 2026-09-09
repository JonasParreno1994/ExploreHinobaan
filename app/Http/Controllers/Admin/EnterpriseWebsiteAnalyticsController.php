<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enterprise;
use App\Services\EnterpriseWebsiteAnalytics;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseWebsiteAnalyticsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, EnterpriseWebsiteAnalytics $analytics): Response
    {
        $from = $request->date('from') ? CarbonImmutable::parse($request->date('from'))->startOfDay() : CarbonImmutable::now()->subDays(29)->startOfDay();
        $to = $request->date('to') ? CarbonImmutable::parse($request->date('to'))->endOfDay() : CarbonImmutable::now()->endOfDay();

        return Inertia::render('admin/tourism-analytics/index', [
            'analytics' => $analytics->summarize(null, $from, $to),
            'enterprises' => Enterprise::query()->where('application_status', 'approved')->withCount('websiteEvents')->orderByDesc('website_events_count')->limit(20)->get(['id', 'business_name', 'slug']),
            'filters' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
        ]);
    }
}
