<?php

namespace App\Models;

use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory;

    protected $fillable = ['reservation_number', 'enterprise_id', 'customer_id', 'customer_name', 'customer_email', 'customer_contact', 'customer_address', 'total_amount', 'status', 'special_request', 'rejection_reason', 'reservation_fee', 'payment_proof_path', 'payment_status', 'payment_verified_at'];

    protected $appends = ['payment_proof_url'];

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

    public function touristArrival(): HasOne
    {
        return $this->hasOne(TouristArrival::class);
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->customer_id === $user->id;
    }

    protected function casts(): array
    {
        return ['total_amount' => 'decimal:2', 'reservation_fee' => 'decimal:2', 'payment_verified_at' => 'datetime'];
    }

    protected function getPaymentProofUrlAttribute(): ?string
    {
        return $this->payment_proof_path ? route('secure-files.reservation-payment-proofs.show', $this) : null;
    }
}
