<?php

namespace App\Models;

use Database\Factories\GalleryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Gallery extends Model
{
    /** @use HasFactory<GalleryFactory> */
    use HasFactory;

    protected $fillable = ['images', 'status'];

    protected $attributes = ['status' => 'active'];

    protected $appends = ['image_urls'];

    protected function casts(): array
    {
        return ['images' => 'array'];
    }

    /** @return list<string> */
    protected function getImageUrlsAttribute(): array
    {
        return collect($this->images)->map(fn (string $path): string => Storage::disk('public')->url($path))->all();
    }
}
