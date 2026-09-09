<?php

namespace App\Models;

use Database\Factories\EnterpriseTourPackageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class EnterpriseTourPackage extends Model
{
    /** @use HasFactory<EnterpriseTourPackageFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'name', 'description', 'rate', 'inclusions', 'exclusions', 'image', 'is_available', 'is_featured'];

    protected $attributes = ['rate' => 0, 'is_available' => true, 'is_featured' => false];

    protected $appends = ['image_url'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function itineraries(): HasMany
    {
        return $this->hasMany(EnterpriseTourItinerary::class)->orderBy('sort_order');
    }

    protected function casts(): array
    {
        return ['rate' => 'decimal:2', 'is_available' => 'boolean', 'is_featured' => 'boolean'];
    }

    protected function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::disk('public')->url($this->image) : null;
    }
}
