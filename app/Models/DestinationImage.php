<?php

namespace App\Models;

use Database\Factories\DestinationImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DestinationImage extends Model
{
    /** @use HasFactory<DestinationImageFactory> */
    use HasFactory;

    protected $fillable = ['destination_id', 'image_path', 'caption', 'sort_order', 'is_primary'];

    protected $attributes = ['sort_order' => 0, 'is_primary' => false];

    protected $appends = ['image_url'];

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    protected function casts(): array
    {
        return ['sort_order' => 'integer', 'is_primary' => 'boolean'];
    }

    protected function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }
}
