<?php

namespace App\Models;

use Database\Factories\LocalProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;

class LocalProduct extends Model
{
    /** @use HasFactory<LocalProductFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'product_category_id', 'name', 'slug', 'sku', 'short_description', 'description', 'price', 'selling_unit', 'stock_quantity', 'low_stock_threshold', 'is_made_to_order', 'preparation_days', 'main_image', 'status', 'is_featured', 'approved_at', 'approved_by', 'rejection_reason'];

    protected $attributes = ['status' => 'draft', 'selling_unit' => 'piece', 'stock_quantity' => 0, 'is_featured' => false, 'is_made_to_order' => false];

    protected $appends = ['main_image_url'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(LocalProductImage::class)->orderBy('sort_order');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(LocalProductOrderItem::class);
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function publishedReviews(): MorphMany
    {
        return $this->reviews()->where('status', 'published');
    }

    protected function casts(): array
    {
        return ['price' => 'decimal:2', 'stock_quantity' => 'integer', 'low_stock_threshold' => 'integer', 'is_made_to_order' => 'boolean', 'is_featured' => 'boolean', 'approved_at' => 'datetime'];
    }

    protected function getMainImageUrlAttribute(): ?string
    {
        return $this->main_image ? Storage::disk('public')->url($this->main_image) : null;
    }
}
