<?php

namespace App\Models;

use Database\Factories\ServiceImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ServiceImage extends Model
{
    /** @use HasFactory<ServiceImageFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_service_id', 'image_path', 'caption', 'sort_order'];

    protected $appends = ['image_url'];

    public function service(): BelongsTo
    {
        return $this->belongsTo(EnterpriseService::class, 'enterprise_service_id');
    }

    protected function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }
}
