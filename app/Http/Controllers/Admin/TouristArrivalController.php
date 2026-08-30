<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateDailyTouristReportRequest;
use App\Models\Barangay;
use App\Models\DailyTouristReport;
use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\TouristArrival;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TouristArrivalController extends Controller
{
    public function index(Request $r): Response
    {
        $q = TouristArrival::query()->with(['enterprise:id,business_name,enterprise_type_id,barangay_id', 'enterprise.enterpriseType:id,name', 'enterprise.barangay:id,name', 'reservation:id,reservation_number', 'service:id,name'])->when($r->date_from, fn (Builder $q, string $v) => $q->whereDate('arrival_date', '>=', $v))->when($r->date_to, fn (Builder $q, string $v) => $q->whereDate('arrival_date', '<=', $v))->when($r->enterprise_id, fn (Builder $q, string $v) => $q->where('enterprise_id', $v))->when($r->enterprise_type_id, fn (Builder $q, string $v) => $q->whereIn('enterprise_id', Enterprise::where('enterprise_type_id', $v)->select('id')))->when($r->barangay_id, fn (Builder $q, string $v) => $q->whereIn('enterprise_id', Enterprise::where('barangay_id', $v)->select('id')))->when($r->visitor_type, fn (Builder $q, string $v) => $q->where('visitor_type', $v))->when($r->booking_source, fn (Builder $q, string $v) => $q->where('booking_source', $v));
        $summary = [
            'total' => (int) (clone $q)->sum('total_guests'),
            'domestic' => (int) (clone $q)->where('visitor_type', 'domestic')->sum('total_guests'),
            'foreign' => (int) (clone $q)->where('visitor_type', 'foreign')->sum('total_guests'),
            'adults' => (int) (clone $q)->sum('adults'),
            'children' => (int) (clone $q)->sum('children'),
            'overnight' => (int) (clone $q)->where('visit_type', 'overnight')->sum('total_guests'),
            'day_visitors' => (int) (clone $q)->where('visit_type', 'day_visit')->sum('total_guests'),
            'tour_participants' => (int) (clone $q)->where('visit_type', 'tour_participant')->sum('total_guests'),
        ];

        return Inertia::render('admin/tourist-arrivals/index', ['arrivals' => $q->latest('arrival_date')->latest('id')->paginate(20)->withQueryString(), 'reports' => DailyTouristReport::with('enterprise:id,business_name')->latest('report_date')->paginate(15, ['*'], 'reports_page')->withQueryString(), 'summary' => $summary, 'filters' => $r->only(['date_from', 'date_to', 'enterprise_id', 'enterprise_type_id', 'barangay_id', 'visitor_type', 'booking_source']), 'enterprises' => Enterprise::whereHas('enterpriseType', fn (Builder $q) => $q->whereIn('slug', $this->slugs()))->orderBy('business_name')->get(['id', 'business_name']), 'enterpriseTypes' => EnterpriseType::whereIn('slug', $this->slugs())->orderBy('name')->get(['id', 'name']), 'barangays' => Barangay::orderBy('name')->get(['id', 'name'])]);
    }

    public function updateReport(UpdateDailyTouristReportRequest $r, DailyTouristReport $dailyTouristReport): RedirectResponse
    {
        $d = $r->validated();
        $dailyTouristReport->update([...$d, 'verified_by' => $d['status'] === 'verified' ? $r->user()->id : null, 'verified_at' => $d['status'] === 'verified' ? now() : null]);

        return back()->with('success', 'Daily tourist report updated.');
    }

    private function slugs(): array
    {
        return ['accommodation', 'resort', 'homestay', 'hotel', 'tour-operator'];
    }
}
