<?php

namespace App\Models;

use Database\Factories\EnterpriseOrderSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnterpriseOrderSetting extends Model
{
    /** @use HasFactory<EnterpriseOrderSettingFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'accepts_pickup', 'accepts_delivery', 'delivery_fee', 'minimum_order_amount', 'order_instructions', 'pickup_instructions', 'estimated_preparation_days', 'accepts_cash_on_pickup', 'accepts_gcash', 'allows_order_cancellation', 'cancellation_window_hours', 'allows_refunds', 'refund_window_days'];

    protected $attributes = ['accepts_pickup' => true, 'accepts_delivery' => false, 'delivery_fee' => 0, 'accepts_cash_on_pickup' => true, 'accepts_gcash' => false, 'allows_order_cancellation' => true, 'cancellation_window_hours' => 24, 'allows_refunds' => false, 'refund_window_days' => 7];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    protected function casts(): array
    {
        return ['accepts_pickup' => 'boolean', 'accepts_delivery' => 'boolean', 'delivery_fee' => 'decimal:2', 'minimum_order_amount' => 'decimal:2', 'accepts_cash_on_pickup' => 'boolean', 'accepts_gcash' => 'boolean', 'allows_order_cancellation' => 'boolean', 'allows_refunds' => 'boolean'];
    }
}
