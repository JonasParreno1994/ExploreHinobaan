<?php

namespace App\Models;

use Database\Factories\ReservationItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservationItem extends Model
{
    /** @use HasFactory<ReservationItemFactory> */
    use HasFactory;

    protected $fillable = ['reservation_id', 'enterprise_service_id', 'service_session_id', 'quantity', 'number_of_guests', 'adults', 'children', 'check_in', 'check_out', 'reservation_date', 'start_time', 'end_time', 'purpose', 'unit_price', 'subtotal'];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(EnterpriseService::class, 'enterprise_service_id');
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(ServiceSession::class, 'service_session_id');
    }

    protected function casts(): array
    {
        return ['check_in' => 'date:Y-m-d', 'check_out' => 'date:Y-m-d', 'reservation_date' => 'date:Y-m-d', 'unit_price' => 'decimal:2', 'subtotal' => 'decimal:2'];
    }
}
