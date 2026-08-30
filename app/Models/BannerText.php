<?php

namespace App\Models;

use Database\Factories\BannerTextFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BannerText extends Model
{
    /** @use HasFactory<BannerTextFactory> */
    use HasFactory;

    protected $fillable = ['header_1', 'header_2', 'header_3'];
}
