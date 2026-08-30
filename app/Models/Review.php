<?php

namespace App\Models;

use Database\Factories\ReviewFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Review extends Model
{
    /** @use HasFactory<ReviewFactory> */
    use HasFactory;

    protected $fillable = ['reviewable_type', 'reviewable_id', 'user_id', 'reservation_id', 'local_product_order_id', 'reviewer_name', 'reviewer_email', 'rating', 'title', 'comment', 'is_verified', 'verification_source', 'status', 'moderation_note', 'reviewed_by', 'reviewed_at'];

    protected function casts(): array
    {
        return ['rating' => 'integer', 'is_verified' => 'boolean', 'reviewed_at' => 'datetime'];
    }

    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function localProductOrder(): BelongsTo
    {
        return $this->belongsTo(LocalProductOrder::class);
    }

    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
