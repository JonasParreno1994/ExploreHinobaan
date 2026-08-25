<?php

namespace App\Models;

use Database\Factories\EnterpriseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Enterprise extends Model
{
    /** @use HasFactory<EnterpriseFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id', 'enterprise_type_id', 'barangay_id', 'business_name', 'slug', 'contact_person', 'email', 'phone',
        'description', 'address', 'latitude', 'longitude', 'website', 'logo', 'cover_image', 'license_number',
        'application_status', 'approved_at', 'approved_by', 'rejection_reason',
    ];

    protected $attributes = ['application_status' => 'pending'];

    protected $appends = ['logo_url', 'cover_image_url'];

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

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'approved_at' => 'datetime',
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
}
