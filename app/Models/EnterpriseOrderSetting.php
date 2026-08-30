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

    protected $fillable = ['enterprise_id', 'accepts_pickup', 'accepts_delivery', 'delivery_fee', 'minimum_order_amount', 'order_instructions', 'pickup_instructions', 'estimated_preparation_days', 'accepts_cash_on_pickup', 'accepts_gcash'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    protected function casts(): array
    {
        return ['accepts_pickup' => 'boolean', 'accepts_delivery' => 'boolean', 'delivery_fee' => 'decimal:2', 'minimum_order_amount' => 'decimal:2', 'accepts_cash_on_pickup' => 'boolean', 'accepts_gcash' => 'boolean'];
    }
}
