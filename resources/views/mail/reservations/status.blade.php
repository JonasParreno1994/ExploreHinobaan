<x-mail::message>
# {{ $statusLabel }}

Hello {{ $reservation->customer_name }},

{{ $intro }}

<x-mail::panel>
**Reservation number:** {{ $reservation->reservation_number }}  
**Enterprise:** {{ $reservation->enterprise->business_name }}  
**Service:** {{ $reservation->items->first()?->service?->name ?? 'Not available' }}  
**Status:** {{ str($reservation->status)->headline() }}  
**Service total:** ₱{{ number_format((float) $reservation->total_amount, 2) }}  
@if ((float) $reservation->reservation_fee > 0)
**Reservation fee:** ₱{{ number_format((float) $reservation->reservation_fee, 2) }}  
**Payment verification:** {{ str($reservation->payment_status)->headline() }}
@endif
</x-mail::panel>

@if ($reservation->status === 'rejected' && $reservation->rejection_reason)
**Reason:** {{ $reservation->rejection_reason }}
@endif

<x-mail::button :url="$statusUrl" color="primary">
View Reservation & Print Acknowledgment
</x-mail::button>

This secure link is valid for 30 days. You can also check the reservation later using your reservation number and email address on the tourism portal.

Thanks,<br>
Explore Hinoba-an Tourism Portal
</x-mail::message>
