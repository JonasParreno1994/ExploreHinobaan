<x-mail::message>
# Product Order {{ str($order->status)->headline() }}

Hello {{ $order->customer_name }},

Your order with **{{ $order->enterprise->business_name }}** is now **{{ str($order->status)->headline() }}**.

<x-mail::panel>
**Order number:** {{ $order->order_number }}  
**Product:** {{ $order->items->first()?->product_name ?? 'Not available' }}  
**Quantity:** {{ $order->items->first()?->quantity ?? 0 }}  
**Total:** ₱{{ number_format((float) $order->total_amount, 2) }}  
**Payment:** {{ str($order->payment_status)->headline() }}
</x-mail::panel>

<x-mail::button :url="$url">
View Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
