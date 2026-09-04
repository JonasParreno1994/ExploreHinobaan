<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\DailyTouristReport;
use App\Models\Destination;
use App\Models\Enterprise;
use App\Models\EnterpriseDocument;
use App\Models\Event;
use App\Models\Review;
use App\Models\SecurityIncident;
use App\Models\TouristArrival;
use App\Models\TouristVerification;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $period = $this->period($request->string('period')->toString());
        [$startDate, $endDate] = $this->dateRange($period);
        $arrivals = $this->arrivalsBetween($startDate, $endDate);
        $summary = (clone $arrivals)->toBase()
            ->selectRaw('COALESCE(SUM(total_guests), 0) as total')
            ->selectRaw("COALESCE(SUM(CASE WHEN visitor_type = 'domestic' THEN total_guests ELSE 0 END), 0) as domestic")
            ->selectRaw("COALESCE(SUM(CASE WHEN visitor_type = 'foreign' THEN total_guests ELSE 0 END), 0) as foreign_visitors")
            ->selectRaw('COALESCE(SUM(adults), 0) as adults')
            ->selectRaw('COALESCE(SUM(children), 0) as children')
            ->selectRaw("COALESCE(SUM(CASE WHEN visit_type = 'day_visit' THEN total_guests ELSE 0 END), 0) as day_visitors")
            ->selectRaw("COALESCE(SUM(CASE WHEN visit_type = 'overnight' THEN total_guests ELSE 0 END), 0) as overnight")
            ->first();

        $previousEnd = $startDate->subDay();
        $previousStart = $previousEnd->subDays($startDate->diffInDays($endDate));
        $previousTotal = (int) $this->arrivalsBetween($previousStart, $previousEnd)->sum('total_guests');
        $totalVisitors = (int) $summary->total;

        return Inertia::render('dashboard', [
            'period' => $period,
            'dateRange' => ['start' => $startDate->toDateString(), 'end' => $endDate->toDateString(), 'label' => $this->periodLabel($period)],
            'statistics' => [
                'total_visitors' => $totalVisitors,
                'domestic' => (int) $summary->domestic,
                'foreign' => (int) $summary->foreign_visitors,
                'adults' => (int) $summary->adults,
                'children' => (int) $summary->children,
                'day_visitors' => (int) $summary->day_visitors,
                'overnight' => (int) $summary->overnight,
                'active_enterprises' => Enterprise::query()->where('application_status', 'approved')->count(),
                'visitor_change' => $previousTotal > 0 ? round((($totalVisitors - $previousTotal) / $previousTotal) * 100, 1) : null,
            ],
            'attention' => $this->attentionCounts($request),
            'arrivalTrend' => $this->arrivalTrend(),
            'topEnterprises' => Enterprise::query()
                ->select(['id', 'enterprise_type_id', 'barangay_id', 'business_name', 'slug'])
                ->with(['enterpriseType:id,name', 'barangay:id,name'])
                ->withSum(['touristArrivals as visitor_count' => fn (Builder $query): Builder => $query->whereBetween('arrival_date', [$startDate, $endDate])], 'total_guests')
                ->where('application_status', 'approved')
                ->orderByDesc('visitor_count')
                ->limit(5)
                ->get(),
            'topDestinations' => Destination::query()->select(['id', 'name', 'slug', 'views'])->where('status', 'published')->orderByDesc('views')->limit(5)->get(),
            'upcomingEvents' => Event::query()
                ->select(['id', 'barangay_id', 'title', 'start_date', 'end_date', 'venue'])
                ->with('barangay:id,name')
                ->where('status', 'published')
                ->whereDate('start_date', '>=', today())
                ->oldest('start_date')
                ->limit(5)
                ->get(),
            'recentActivity' => AuditLog::query()->select(['id', 'actor_name', 'action', 'path', 'created_at'])->latest()->limit(6)->get(),
            'isAdministrator' => $request->user()?->role?->name === 'Administrator',
        ]);
    }

    /** @return array<string, array{count: int, href: string}> */
    private function attentionCounts(Request $request): array
    {
        $counts = [
            'enterprise_applications' => ['count' => Enterprise::query()->where('application_status', 'pending')->count(), 'href' => route('admin.enterprises.index', ['status' => 'pending'])],
            'enterprise_documents' => ['count' => EnterpriseDocument::query()->where('verification_status', 'pending')->count(), 'href' => route('admin.enterprises.index')],
            'tourist_verifications' => ['count' => TouristVerification::query()->where('verification_status', 'pending')->count(), 'href' => route('admin.tourist-verifications.index', ['status' => 'pending'])],
            'daily_reports' => ['count' => DailyTouristReport::query()->where('status', 'submitted')->count(), 'href' => route('admin.tourist-arrivals.index')],
            'reviews' => ['count' => Review::query()->where('status', 'pending')->count(), 'href' => route('admin.reviews.index', ['status' => 'pending'])],
        ];

        if ($request->user()?->role?->name === 'Administrator') {
            $counts['security_incidents'] = ['count' => SecurityIncident::query()->whereNotIn('status', ['resolved', 'closed'])->count(), 'href' => route('admin.security-monitoring.index')];
        }

        return $counts;
    }

    /** @return array<int, array{label: string, value: int}> */
    private function arrivalTrend(): array
    {
        return collect(range(5, 0))->map(function (int $monthsAgo): array {
            $month = CarbonImmutable::now()->startOfMonth()->subMonths($monthsAgo);

            return [
                'label' => $month->format('M'),
                'value' => (int) TouristArrival::query()->whereBetween('arrival_date', [$month, $month->endOfMonth()])->sum('total_guests'),
            ];
        })->all();
    }

    private function arrivalsBetween(CarbonImmutable $startDate, CarbonImmutable $endDate): Builder
    {
        return TouristArrival::query()->whereBetween('arrival_date', [$startDate, $endDate]);
    }

    private function period(string $period): string
    {
        return in_array($period, ['today', 'week', 'month', 'year'], true) ? $period : 'month';
    }

    /** @return array{CarbonImmutable, CarbonImmutable} */
    private function dateRange(string $period): array
    {
        $today = CarbonImmutable::today();

        return match ($period) {
            'today' => [$today, $today],
            'week' => [$today->startOfWeek(), $today->endOfWeek()],
            'year' => [$today->startOfYear(), $today->endOfYear()],
            default => [$today->startOfMonth(), $today->endOfMonth()],
        };
    }

    private function periodLabel(string $period): string
    {
        return match ($period) {
            'today' => 'Today',
            'week' => 'This week',
            'year' => 'This year',
            default => 'This month',
        };
    }
}
