<?php

namespace App\Models;

use Database\Factories\HeaderSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class HeaderSetting extends Model
{
    /** @use HasFactory<HeaderSettingFactory> */
    use HasFactory;

    protected $fillable = ['name', 'site_name', 'tagline', 'logo_path', 'social_image_path', 'webapp_logo_path', 'login_label', 'register_label', 'status'];

    protected $appends = ['logo_url', 'social_image_url', 'webapp_logo_url'];

    protected $attributes = ['login_label' => 'Login', 'register_label' => 'Be a Partner', 'status' => 'active'];

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? Storage::disk('public')->url($this->logo_path) : null;
    }

    public function getSocialImageUrlAttribute(): ?string
    {
        return $this->social_image_path ? Storage::disk('public')->url($this->social_image_path) : null;
    }

    public function getWebappLogoUrlAttribute(): ?string
    {
        return $this->webapp_logo_path ? Storage::disk('public')->url($this->webapp_logo_path) : null;
    }
}
