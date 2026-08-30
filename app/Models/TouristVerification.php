<?php

namespace App\Models;

use Database\Factories\TouristVerificationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TouristVerification extends Model
{
    /** @use HasFactory<TouristVerificationFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'id_type', 'id_front_path', 'id_back_path', 'selfie_with_id_path', 'verification_status', 'rejection_reason', 'verified_by', 'verified_at', 'submitted_at', 'documents_deleted_at'];

    protected $hidden = ['id_front_path', 'id_back_path', 'selfie_with_id_path'];

    protected $attributes = ['verification_status' => 'pending'];

    protected function casts(): array
    {
        return ['verified_at' => 'datetime', 'submitted_at' => 'datetime', 'documents_deleted_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
