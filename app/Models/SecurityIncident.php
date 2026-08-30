<?php

namespace App\Models;

use Database\Factories\SecurityIncidentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityIncident extends Model
{
    /** @use HasFactory<SecurityIncidentFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['security_event_id', 'assigned_to', 'title', 'description', 'severity', 'status', 'notes', 'contained_at', 'resolved_at'];

    protected function casts(): array
    {
        return ['contained_at' => 'datetime', 'resolved_at' => 'datetime'];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(SecurityEvent::class, 'security_event_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
