<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Models\LocalProductOrder;
use App\Notifications\LocalProductOrderStatusNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
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
        $order->loadMissing('enterprise.orderSetting');
        $settings = $order->enterprise->orderSetting ?? $order->enterprise->orderSetting()->create();

        $nextStatus = $data['status'] ?? null;
        $allowedTransitions = [
            'pending' => ['accepted', 'rejected', 'cancelled'],
            'accepted' => ['preparing', 'cancelled'],
            'preparing' => ['ready_for_pickup', 'out_for_delivery', 'cancelled'],
            'ready_for_pickup' => ['completed', 'cancelled'],
            'out_for_delivery' => ['completed', 'cancelled'],
            'completed' => [],
            'rejected' => [],
            'cancelled' => [],
        ];
        if ($nextStatus !== null && $nextStatus !== $order->status && ! in_array($nextStatus, $allowedTransitions[$order->status] ?? [], true)) {
            throw ValidationException::withMessages(['status' => "An order cannot move from {$order->status} to {$nextStatus}."]);
        }
        if ($nextStatus === 'cancelled') {
            if (! $settings->allows_order_cancellation) {
                throw ValidationException::withMessages(['status' => 'Order cancellation is disabled by the seller policy.']);
            }
            if ($settings->cancellation_window_hours !== null && now()->isAfter($order->created_at->addHours($settings->cancellation_window_hours))) {
                throw ValidationException::withMessages(['status' => 'The cancellation window for this order has expired.']);
            }
        }
        if (($data['payment_status'] ?? null) === 'refunded') {
            if (! $settings->allows_refunds) {
                throw ValidationException::withMessages(['payment_status' => 'Refunds are disabled by the seller policy.']);
            }
            if ($order->payment_status !== 'verified') {
                throw ValidationException::withMessages(['payment_status' => 'Only a verified payment can be refunded.']);
            }
            $refundPeriodStartedAt = $order->completed_at ?? $order->created_at;
            if ($settings->refund_window_days !== null && now()->isAfter($refundPeriodStartedAt->addDays($settings->refund_window_days))) {
                throw ValidationException::withMessages(['payment_status' => 'The refund window for this order has expired.']);
            }
        }
        if (($data['status'] ?? null) === 'accepted' && $order->payment_method === 'gcash' && $order->payment_status !== 'verified' && ($data['payment_status'] ?? null) !== 'verified') {
            abort(422, 'Verify GCash payment before accepting this order.');
        }
        $order->update([...$data, 'confirmed_at' => ($data['status'] ?? null) === 'accepted' ? now() : $order->confirmed_at, 'completed_at' => ($data['status'] ?? null) === 'completed' ? now() : $order->completed_at]);
        $order->refresh();
        if ($order->customer) {
            $order->customer->notify(new LocalProductOrderStatusNotification($order));
        } else {
            Notification::route('mail', $order->customer_email)->notify(new LocalProductOrderStatusNotification($order));
        }

        return back()->with('success', 'Order updated.');
    }

    private function authorizeOwner(Request $request, LocalProductOrder $order): void
    {
        abort_unless($order->enterprise()->where('user_id', $request->user()->id)->exists(), 403);
    }
}
