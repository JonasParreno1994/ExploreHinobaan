<?php

namespace App\Models;

use Database\Factories\EnterpriseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;

class Enterprise extends Model
{
    /** @use HasFactory<EnterpriseFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id', 'enterprise_type_id', 'barangay_id', 'business_name', 'slug', 'contact_person', 'email', 'phone',
        'description', 'address', 'latitude', 'longitude', 'website', 'logo', 'cover_image', 'license_number',
        'application_status', 'approved_at', 'approved_by', 'rejection_reason', 'reservation_fee', 'gcash_qr_path',
    ];

    protected $attributes = ['application_status' => 'pending'];

    protected $appends = ['logo_url', 'cover_image_url', 'gcash_qr_url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function enterpriseType(): BelongsTo
    {
        return $this->belongsTo(EnterpriseType::class);
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EnterpriseDocument::class)->latest('id');
    }

    public function services(): HasMany
    {
        return $this->hasMany(EnterpriseService::class);
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(EnterpriseGalleryImage::class)->orderBy('sort_order');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function localProducts(): HasMany
    {
        return $this->hasMany(LocalProduct::class);
    }

    public function localProductOrders(): HasMany
    {
        return $this->hasMany(LocalProductOrder::class);
    }

    public function touristArrivals(): HasMany
    {
        return $this->hasMany(TouristArrival::class);
    }

    public function dailyTouristReports(): HasMany
    {
        return $this->hasMany(DailyTouristReport::class);
    }

    public function supportsArrivalReporting(): bool
    {
        return in_array($this->enterpriseType?->slug, ['accommodation', 'resort', 'homestay', 'hotel', 'tour-operator'], true);
    }

    public function orderSetting(): HasOne
    {
        return $this->hasOne(EnterpriseOrderSetting::class);
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
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'approved_at' => 'datetime',
            'reservation_fee' => 'decimal:2',
        ];
    }

    protected function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? Storage::disk('public')->url($this->logo) : null;
    }

    protected function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null;
    }

    protected function getGcashQrUrlAttribute(): ?string
    {
        return $this->gcash_qr_path ? Storage::disk('public')->url($this->gcash_qr_path) : null;
    }
}
