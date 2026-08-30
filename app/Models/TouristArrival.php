<?php

namespace App\Models;

use Database\Factories\TouristArrivalFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TouristArrival extends Model
{
    /** @use HasFactory<TouristArrivalFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'reservation_id', 'enterprise_service_id', 'created_by', 'arrival_date', 'check_in_date', 'check_out_date', 'booking_source', 'visitor_type', 'country', 'province', 'city_municipality', 'adults', 'children', 'total_guests', 'visit_type', 'arrival_type', 'purpose_of_visit', 'notes'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(EnterpriseService::class, 'enterprise_service_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    protected function casts(): array
    {
        return ['arrival_date' => 'date:Y-m-d', 'check_in_date' => 'date:Y-m-d', 'check_out_date' => 'date:Y-m-d'];
    }
}
