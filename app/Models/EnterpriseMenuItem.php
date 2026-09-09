<?php

namespace App\Models;

use Database\Factories\EnterpriseMenuItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class EnterpriseMenuItem extends Model
{
    /** @use HasFactory<EnterpriseMenuItemFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'enterprise_menu_category_id', 'name', 'description', 'price', 'image', 'is_available', 'is_featured', 'is_best_seller', 'is_new', 'sort_order'];

    protected $attributes = ['is_available' => true, 'is_featured' => false, 'is_best_seller' => false, 'is_new' => false, 'sort_order' => 0];

    protected $appends = ['image_url'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EnterpriseMenuCategory::class, 'enterprise_menu_category_id');
    }

    protected function casts(): array
    {
        return ['price' => 'decimal:2', 'is_available' => 'boolean', 'is_featured' => 'boolean', 'is_best_seller' => 'boolean', 'is_new' => 'boolean', 'sort_order' => 'integer'];
    }

    protected function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::disk('public')->url($this->image) : null;
    }
}
