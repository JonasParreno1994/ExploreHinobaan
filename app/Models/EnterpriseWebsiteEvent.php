<?php

namespace App\Models;

use Database\Factories\EnterpriseWebsiteEventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnterpriseWebsiteEvent extends Model
{
    /** @use HasFactory<EnterpriseWebsiteEventFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'event_type', 'visitor_hash', 'target_type', 'target_id', 'target_label', 'metadata'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }
}
