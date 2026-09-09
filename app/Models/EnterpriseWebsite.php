<?php

namespace App\Models;

use App\EnterpriseWebsiteTemplate;
use Database\Factories\EnterpriseWebsiteFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class EnterpriseWebsite extends Model
{
    /** @use HasFactory<EnterpriseWebsiteFactory> */
    use HasFactory;

    protected $fillable = [
        'enterprise_id', 'template', 'logo', 'cover_image', 'tagline', 'primary_color', 'secondary_color',
        'accent_color', 'seo_title', 'seo_description', 'social_title', 'social_description', 'social_image', 'is_published', 'published_at', 'published_snapshot',
    ];

    protected $attributes = ['template' => 'tropical', 'primary_color' => '#0F766E', 'secondary_color' => '#F97316', 'accent_color' => '#FBBF24', 'is_published' => false];

    protected $appends = ['logo_url', 'cover_image_url', 'social_image_url'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function completionPercentage(): int
    {
        $sections = $this->enterprise->sections->keyBy('section_type');
        $checks = [
            filled($this->logo), filled($this->cover_image), filled($this->tagline),
            filled($sections->get('home')?->content), filled($sections->get('about')?->content),
            filled($sections->get('amenities')?->content), filled($sections->get('policies')?->content),
            $this->enterprise->galleryImages->isNotEmpty(), filled($this->enterprise->address),
            filled($this->enterprise->phone) || filled($this->enterprise->email),
            $this->enterprise->socialLinks->isNotEmpty(), filled($this->seo_title) && filled($this->seo_description),
        ];

        return (int) round(collect($checks)->filter()->count() / count($checks) * 100);
    }

    protected function casts(): array
    {
        return ['template' => EnterpriseWebsiteTemplate::class, 'is_published' => 'boolean', 'published_at' => 'datetime', 'published_snapshot' => 'array'];
    }

    protected function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? Storage::disk('public')->url($this->logo) : null;
    }

    protected function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null;
    }

    protected function getSocialImageUrlAttribute(): ?string
    {
        return $this->social_image ? Storage::disk('public')->url($this->social_image) : null;
    }
}
