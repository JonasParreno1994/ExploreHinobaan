<?php

namespace App\Models;

use Database\Factories\DestinationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Destination extends Model
{
    /** @use HasFactory<DestinationFactory> */
    use HasFactory;

    protected $fillable = [
        'category_id', 'barangay_id', 'name', 'short_description', 'description', 'address', 'latitude', 'longitude',
        'entrance_fee', 'opening_time', 'closing_time', 'contact_number', 'email', 'website', 'featured_image',
        'status', 'is_featured', 'views', 'created_by',
    ];

    protected $attributes = ['status' => 'draft', 'is_featured' => false, 'views' => 0];

    protected $appends = ['featured_image_url'];

    protected static function booted(): void
    {
        static::saving(function (Destination $destination): void {
            $destination->slug = Str::slug($destination->name);
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TourismCategory::class, 'category_id');
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function images(): HasMany
    {
        return $this->hasMany(DestinationImage::class)->orderBy('sort_order')->orderBy('id');
    }

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7', 'longitude' => 'decimal:7', 'entrance_fee' => 'decimal:2',
            'is_featured' => 'boolean', 'views' => 'integer',
        ];
    }

    protected function getFeaturedImageUrlAttribute(): ?string
    {
        return $this->featured_image ? Storage::disk('public')->url($this->featured_image) : null;
    }
}
