<?php

namespace App\Models;

use Database\Factories\LocalProductOrderItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LocalProductOrderItem extends Model
{
    /** @use HasFactory<LocalProductOrderItemFactory> */
    use HasFactory;

    protected $fillable = ['local_product_order_id', 'local_product_id', 'product_name', 'quantity', 'unit', 'unit_price', 'subtotal'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(LocalProductOrder::class, 'local_product_order_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(LocalProduct::class, 'local_product_id');
    }

    protected function casts(): array
    {
        return ['unit_price' => 'decimal:2', 'subtotal' => 'decimal:2'];
    }
}
