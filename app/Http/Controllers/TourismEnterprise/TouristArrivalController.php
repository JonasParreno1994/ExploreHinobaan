<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\StoreTouristArrivalRequest;
use App\Models\Enterprise;
use App\Models\Reservation;
use App\Models\TouristArrival;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TouristArrivalController extends Controller
{
    public function index(Request $request): Response
    {
        $ids = $this->ids($request);
        $q = TouristArrival::whereIn('enterprise_id', $ids)->with(['enterprise:id,business_name', 'reservation:id,reservation_number', 'service:id,name'])->when($request->date_from, fn ($q, $v) => $q->whereDate('arrival_date', '>=', $v))->when($request->date_to, fn ($q, $v) => $q->whereDate('arrival_date', '<=', $v))->when($request->visitor_type, fn ($q, $v) => $q->where('visitor_type', $v))->when($request->booking_source, fn ($q, $v) => $q->where('booking_source', $v));
        $today = TouristArrival::whereIn('enterprise_id', $ids)->whereDate('arrival_date', today());

        return Inertia::render('tourism-enterprise/tourist-arrivals/index', ['arrivals' => $q->latest('arrival_date')->paginate(15)->withQueryString(), 'filters' => $request->only(['date_from', 'date_to', 'visitor_type', 'booking_source']), 'statistics' => $this->summary($today)]);
    }

    public function create(Request $request): Response
    {
        $enterprises = Enterprise::whereIn('id', $this->ids($request))->with(['enterpriseType:id,name,slug', 'services:id,enterprise_id,name'])->get();
        $reservation = $request->integer('reservation') ? Reservation::whereIn('enterprise_id', $enterprises->pluck('id'))->where('status', 'confirmed')->with(['items.service:id,name'])->findOrFail($request->integer('reservation')) : null;
        abort_if($reservation?->touristArrival()->exists(), 422, 'Arrival already recorded.');

        return Inertia::render('tourism-enterprise/tourist-arrivals/create', ['enterprises' => $enterprises, 'reservation' => $reservation]);
    }

    public function store(StoreTouristArrivalRequest $request): RedirectResponse
    {
        $data = $request->validated();
        abort_unless(in_array((int) $data['enterprise_id'], $this->ids($request), true), 403);
        if (! empty($data['reservation_id'])) {
            $reservation = Reservation::where('enterprise_id', $data['enterprise_id'])->where('status', 'confirmed')->findOrFail($data['reservation_id']);
            abort_if($reservation->touristArrival()->exists(), 422, 'Arrival already recorded.');
            $data['booking_source'] = 'website_reservation';
        } $data['country'] = $data['visitor_type'] === 'domestic' ? 'Philippines' : $data['country'];
        $data['total_guests'] = (int) $data['adults'] + (int) $data['children'];
        throw_if($data['total_guests'] < 1, ValidationException::withMessages(['adults' => 'At least one tourist is required.']));
        $data['created_by'] = $request->user()->id;
        TouristArrival::create($data);

        return to_route('partner.tourist-arrivals.index')->with('success', 'Tourist arrival recorded.');
    }

    private function ids(Request $r): array
    {
        return $r->user()->enterprises()->where('application_status', 'approved')->whereHas('enterpriseType', fn ($q) => $q->whereIn('slug', ['accommodation', 'resort', 'homestay', 'hotel', 'tour-operator']))->pluck('id')->map(fn ($id) => (int) $id)->all();
    }

    private function summary($q): array
    {
        return (array) $q->toBase()->selectRaw('coalesce(sum(total_guests),0) total, coalesce(sum(adults),0) adults, coalesce(sum(children),0) children, coalesce(sum(case when visitor_type=? then total_guests else 0 end),0) domestic, coalesce(sum(case when visitor_type=? then total_guests else 0 end),0) foreign', ['domestic', 'foreign'])->first();
    }
}
