<?php

namespace App\Models;

use Database\Factories\BannerTextFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BannerText extends Model
{
    /** @use HasFactory<BannerTextFactory> */
    use HasFactory;

    protected $fillable = ['header_1', 'header_2', 'header_3'];

    public function banner(): BelongsTo
    {
        return $this->belongsTo(Banner::class);
    }
}
