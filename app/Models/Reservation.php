<?php

namespace App\Models;

use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory;

    protected $fillable = ['reservation_number', 'enterprise_id', 'customer_id', 'customer_name', 'customer_email', 'customer_contact', 'total_amount', 'status', 'special_request', 'rejection_reason'];

    protected $attributes = ['status' => 'pending'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ReservationItem::class);
    }

    protected function casts(): array
    {
        return ['total_amount' => 'decimal:2'];
    }
}
