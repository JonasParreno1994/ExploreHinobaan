<?php

namespace App\Models;

use Database\Factories\LguInformationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class LguInformation extends Model
{
    /** @use HasFactory<LguInformationFactory> */
    use HasFactory;

    protected $fillable = ['history', 'mission', 'vision', 'area', 'number_of_barangays', 'location', 'images'];

    protected $appends = ['image_urls'];

    protected function casts(): array
    {
        return ['images' => 'array', 'area' => 'decimal:2', 'number_of_barangays' => 'integer'];
    }

    /** @return list<string> */
    protected function getImageUrlsAttribute(): array
    {
        return collect($this->images)->map(fn (string $path): string => Storage::disk('public')->url($path))->all();
    }
}
