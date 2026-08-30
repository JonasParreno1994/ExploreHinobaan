<?php

namespace App\Models;

use Database\Factories\LocalProductImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class LocalProductImage extends Model
{
    /** @use HasFactory<LocalProductImageFactory> */
    use HasFactory;

    protected $fillable = ['local_product_id', 'image_path', 'caption', 'sort_order'];

    protected $appends = ['image_url'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(LocalProduct::class, 'local_product_id');
    }

    protected function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }
}
