<?php

namespace App\Models;

use Database\Factories\EnterpriseServiceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;

class EnterpriseService extends Model
{
    /** @use HasFactory<EnterpriseServiceFactory> */
    use HasFactory;

    protected $fillable = [
        'enterprise_id', 'service_type_id', 'name', 'slug', 'short_description', 'description', 'price', 'pricing_unit',
        'capacity', 'quantity', 'amenities', 'main_image', 'reservation_required', 'reservation_mode', 'pool_type', 'check_in_time', 'check_out_time',
        'duration_minutes', 'status',
    ];

    protected $attributes = ['price' => 0, 'pricing_unit' => 'per_service', 'quantity' => 1, 'reservation_required' => true, 'status' => 'draft'];

    protected $appends = ['main_image_url'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ServiceImage::class)->orderBy('sort_order');
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(ServiceAvailability::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(ServiceSession::class)->orderBy('start_time');
    }

    public function reservationItems(): HasMany
    {
        return $this->hasMany(ReservationItem::class);
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
        return ['price' => 'decimal:2', 'capacity' => 'integer', 'quantity' => 'integer', 'amenities' => 'array', 'reservation_required' => 'boolean'];
    }

    protected function getMainImageUrlAttribute(): ?string
    {
        return $this->main_image ? Storage::disk('public')->url($this->main_image) : null;
    }
}
