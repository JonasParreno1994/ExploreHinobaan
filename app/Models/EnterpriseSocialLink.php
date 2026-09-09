<?php

namespace App\Models;

use Database\Factories\EnterpriseSocialLinkFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnterpriseSocialLink extends Model
{
    /** @use HasFactory<EnterpriseSocialLinkFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'platform', 'url'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }
}
