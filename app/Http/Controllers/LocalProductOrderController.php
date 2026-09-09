<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLocalProductOrderRequest;
use App\Models\LocalProduct;
use App\Models\LocalProductOrder;
use App\Notifications\LocalProductOrderStatusNotification;
use App\Notifications\NewPartnerActivityNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LocalProductOrderController extends Controller
{
    public function store(StoreLocalProductOrderRequest $request): RedirectResponse
    {
        $order = DB::transaction(function () use ($request): LocalProductOrder {
            $product = LocalProduct::query()->with('enterprise.orderSetting')->lockForUpdate()->findOrFail($request->integer('product_id'));
            abort_unless($product->status === 'published' && $product->enterprise->application_status === 'approved', 404);
            $data = $request->validated();
            if (! $product->is_made_to_order && $data['quantity'] > $product->stock_quantity) {
                throw ValidationException::withMessages(['quantity' => "Only {$product->stock_quantity} item(s) are available."]);
            }
            $settings = $product->enterprise->orderSetting()->firstOrCreate([]);
            abort_if($data['fulfillment_method'] === 'delivery' && ! $settings->accepts_delivery, 422);
            abort_if($data['payment_method'] === 'gcash' && ! $settings->accepts_gcash, 422);
            $subtotal = round((float) $product->price * $data['quantity'], 2);
            $deliveryFee = $data['fulfillment_method'] === 'delivery' ? (float) $settings->delivery_fee : 0;
            $proof = $request->file('payment_proof')?->store('local-product-orders/payment-proofs', 'local');
            $order = LocalProductOrder::create(['order_number' => 'HIN-PROD-'.now()->format('Y').'-'.Str::upper(Str::random(8)), 'enterprise_id' => $product->enterprise_id, 'customer_id' => $request->user()?->id, 'customer_name' => $data['customer_name'], 'customer_email' => $data['customer_email'], 'customer_contact' => $data['customer_contact'], 'fulfillment_method' => $data['fulfillment_method'], 'delivery_address' => $data['delivery_address'] ?? null, 'subtotal' => $subtotal, 'delivery_fee' => $deliveryFee, 'total_amount' => $subtotal + $deliveryFee, 'payment_method' => $data['payment_method'], 'payment_status' => $proof ? 'pending_verification' : 'unpaid', 'payment_proof_path' => $proof, 'customer_notes' => $data['customer_notes'] ?? null]);
            $order->items()->create(['local_product_id' => $product->id, 'product_name' => $product->name, 'quantity' => $data['quantity'], 'unit' => $product->selling_unit, 'unit_price' => $product->price, 'subtotal' => $subtotal]);
            if (! $product->is_made_to_order) {
                $product->decrement('stock_quantity', $data['quantity']);
            }

            return $order;
        });

        if ($order->customer) {
            $order->customer->notify(new LocalProductOrderStatusNotification($order));
        } else {
            Notification::route('mail', $order->customer_email)->notify(new LocalProductOrderStatusNotification($order));
        }

        $enterprise = $order->enterprise()->with('user:id,name,email')->firstOrFail();
        $enterprise->user?->notify(new NewPartnerActivityNotification(
            activityType: 'product_order',
            title: 'New product order received',
            message: "{$order->customer_name} placed a product order from {$enterprise->business_name}.",
            reference: $order->order_number,
            url: route('partner.product-orders.show', $order),
        ));

        return to_route('local-product-orders.success', $order->order_number);
    }

    public function success(string $orderNumber): Response
    {
        $order = LocalProductOrder::query()->where('order_number', $orderNumber)->with(['enterprise:id,business_name,slug', 'items'])->firstOrFail();

        return Inertia::render('local-product-orders/success', ['order' => $order]);
    }
}
