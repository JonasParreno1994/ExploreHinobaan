<?php

namespace App\Models;

use Database\Factories\FooterSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FooterSetting extends Model
{
    /** @use HasFactory<FooterSettingFactory> */
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'municipality', 'office', 'address', 'email', 'phone',
        'facebook_url', 'instagram_url', 'youtube_url', 'copyright_text', 'status',
    ];

    protected $attributes = ['status' => 'active'];
}
