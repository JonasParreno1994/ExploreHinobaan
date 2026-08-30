<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Models\LocalProductOrder;
use App\Notifications\LocalProductOrderStatusNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LocalProductOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = LocalProductOrder::query()->whereHas('enterprise', fn ($query) => $query->where('user_id', $request->user()->id))->with(['enterprise:id,business_name', 'items'])->latest()->paginate(20);

        return Inertia::render('tourism-enterprise/product-orders/index', ['orders' => $orders]);
    }

    public function show(Request $request, LocalProductOrder $order): Response
    {
        $this->authorizeOwner($request, $order);

        return Inertia::render('tourism-enterprise/product-orders/show', ['order' => $order->load(['enterprise:id,business_name', 'items.product:id,name'])]);
    }

    public function update(Request $request, LocalProductOrder $order): RedirectResponse
    {
        $this->authorizeOwner($request, $order);
        $data = $request->validate(['status' => ['nullable', Rule::in(['accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'completed', 'rejected', 'cancelled'])], 'payment_status' => ['nullable', Rule::in(['verified', 'rejected', 'refunded'])], 'rejection_reason' => ['nullable', 'required_if:status,rejected', 'string', 'max:2000']]);
        if (($data['status'] ?? null) === 'accepted' && $order->payment_method === 'gcash' && $order->payment_status !== 'verified' && ($data['payment_status'] ?? null) !== 'verified') {
            abort(422, 'Verify GCash payment before accepting this order.');
        }
        $order->update([...$data, 'confirmed_at' => ($data['status'] ?? null) === 'accepted' ? now() : $order->confirmed_at, 'completed_at' => ($data['status'] ?? null) === 'completed' ? now() : $order->completed_at]);
        Notification::route('mail', $order->customer_email)->notify(new LocalProductOrderStatusNotification($order->refresh()));

        return back()->with('success', 'Order updated.');
    }

    private function authorizeOwner(Request $request, LocalProductOrder $order): void
    {
        abort_unless($order->enterprise()->where('user_id', $request->user()->id)->exists(), 403);
    }
}
