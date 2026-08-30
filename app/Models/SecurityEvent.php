<?php

namespace App\Models;

use Database\Factories\SecurityEventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SecurityEvent extends Model
{
    /** @use HasFactory<SecurityEventFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['user_id', 'event_type', 'attack_type', 'severity', 'risk_score', 'decision', 'result', 'role_name', 'endpoint', 'method', 'ip_address', 'user_agent', 'affected_resource', 'explanation', 'metadata', 'detected_at'];

    protected function casts(): array
    {
        return ['explanation' => 'array', 'metadata' => 'array', 'detected_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function incidents(): HasMany
    {
        return $this->hasMany(SecurityIncident::class);
    }
}
