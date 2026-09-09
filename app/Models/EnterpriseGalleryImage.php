<?php

namespace App\Models;

use Database\Factories\EnterpriseGalleryImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class EnterpriseGalleryImage extends Model
{
    /** @use HasFactory<EnterpriseGalleryImageFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'image_path', 'caption', 'sort_order', 'is_featured'];

    protected $attributes = ['sort_order' => 0, 'is_featured' => false];

    protected $appends = ['image_url'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    protected function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }

    protected function casts(): array
    {
        return ['sort_order' => 'integer', 'is_featured' => 'boolean'];
    }
}
