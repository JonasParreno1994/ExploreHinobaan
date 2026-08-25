<?php

namespace App\Models;

use Database\Factories\EventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Event extends Model
{
    /** @use HasFactory<EventFactory> */
    use HasFactory;

    protected $fillable = [
        'barangay_id', 'title', 'slug', 'event_type', 'short_description', 'description', 'venue', 'start_date', 'end_date',
        'start_time', 'end_time', 'featured_image', 'registration_link', 'organizer', 'contact_number', 'status', 'is_featured', 'created_by',
    ];

    protected $attributes = ['status' => 'draft', 'is_featured' => false];

    protected $appends = ['featured_image_url', 'schedule_status'];

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    protected function casts(): array
    {
        return ['start_date' => 'date:Y-m-d', 'end_date' => 'date:Y-m-d', 'is_featured' => 'boolean'];
    }

    protected function getFeaturedImageUrlAttribute(): ?string
    {
        return $this->featured_image ? Storage::disk('public')->url($this->featured_image) : null;
    }

    protected function getScheduleStatusAttribute(): string
    {
        if ($this->start_date === null) {
            return 'schedule_pending';
        }

        $today = today();
        if (($this->end_date ?? $this->start_date)->lt($today)) {
            return 'past';
        }

        return $this->start_date->gt($today) ? 'upcoming' : 'ongoing';
    }
}
