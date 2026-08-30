<?php

namespace App\Models;

use Database\Factories\BannerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Banner extends Model
{
    /** @use HasFactory<BannerFactory> */
    use HasFactory;

    protected $fillable = ['images', 'sentences', 'status'];

    protected $attributes = ['status' => 'active'];

    protected $appends = ['image_urls'];

    protected function casts(): array
    {
        return ['images' => 'array', 'sentences' => 'array'];
    }

    /** @return list<string> */
    protected function getImageUrlsAttribute(): array
    {
        return collect($this->images)->map(fn (string $path): string => Storage::disk('public')->url($path))->all();
    }
}
