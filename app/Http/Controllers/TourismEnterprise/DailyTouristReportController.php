<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Models\DailyTouristReport;
use App\Models\Enterprise;
use App\Models\TouristArrival;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyTouristReportController extends Controller
{
    public function index(Request $r): Response
    {
        $ids = $this->ids($r);
        $date = $r->date('date') ?? today();
        $summary = TouristArrival::whereIn('enterprise_id', $ids)->whereDate('arrival_date', $date)->toBase()->selectRaw('coalesce(sum(total_guests),0) total, coalesce(sum(adults),0) adults, coalesce(sum(children),0) children, coalesce(sum(case when visitor_type=? then total_guests else 0 end),0) domestic, coalesce(sum(case when visitor_type=? then total_guests else 0 end),0) foreign', ['domestic', 'foreign'])->first();

        return Inertia::render('tourism-enterprise/daily-reports/index', ['date' => $date->toDateString(), 'summary' => $summary, 'reports' => DailyTouristReport::with('enterprise:id,business_name')->whereIn('enterprise_id', $ids)->latest('report_date')->paginate(15), 'enterprises' => Enterprise::whereIn('id', $ids)->get(['id', 'business_name'])]);
    }

    public function store(Request $r): RedirectResponse
    {
        $d = $r->validate(['enterprise_id' => ['required', 'integer'], 'report_date' => ['required', 'date', 'before_or_equal:today']]);
        abort_unless(in_array((int) $d['enterprise_id'], $this->ids($r), true), 403);
        DailyTouristReport::updateOrCreate(['enterprise_id' => $d['enterprise_id'], 'report_date' => $d['report_date']], ['status' => 'submitted', 'submitted_by' => $r->user()->id, 'submitted_at' => now()]);

        return back()->with('success', 'Daily tourist report submitted.');
    }

    private function ids(Request $r): array
    {
        return $r->user()->enterprises()->where('application_status', 'approved')->whereHas('enterpriseType', fn ($q) => $q->whereIn('slug', ['accommodation', 'resort', 'homestay', 'hotel', 'tour-operator']))->pluck('id')->map(fn ($id) => (int) $id)->all();
    }
}
