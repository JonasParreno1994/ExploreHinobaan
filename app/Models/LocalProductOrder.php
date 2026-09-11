<?php

namespace App\Models;

use Database\Factories\LocalProductOrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LocalProductOrder extends Model
{
    /** @use HasFactory<LocalProductOrderFactory> */
    use HasFactory;

    protected $fillable = ['order_number', 'enterprise_id', 'customer_id', 'customer_name', 'customer_email', 'customer_contact', 'fulfillment_method', 'delivery_address', 'subtotal', 'delivery_fee', 'total_amount', 'payment_method', 'payment_status', 'payment_proof_path', 'status', 'customer_notes', 'producer_notes', 'rejection_reason', 'estimated_ready_at', 'confirmed_at', 'completed_at'];

    protected $attributes = ['status' => 'pending', 'payment_status' => 'unpaid'];

    protected $appends = ['payment_proof_url'];

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
        return $this->hasMany(LocalProductOrderItem::class);
    }

    protected function casts(): array
    {
        return ['subtotal' => 'decimal:2', 'delivery_fee' => 'decimal:2', 'total_amount' => 'decimal:2', 'estimated_ready_at' => 'datetime', 'confirmed_at' => 'datetime', 'completed_at' => 'datetime'];
    }

    protected function getPaymentProofUrlAttribute(): ?string
    {
        return $this->payment_proof_path ? route('secure-files.product-order-payment-proofs.show', $this) : null;
    }
}
