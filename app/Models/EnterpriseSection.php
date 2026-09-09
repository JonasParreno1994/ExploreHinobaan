<?php

namespace App\Models;

use Database\Factories\EnterpriseSectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnterpriseSection extends Model
{
    /** @use HasFactory<EnterpriseSectionFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'section_type', 'title', 'subtitle', 'content', 'is_visible', 'sort_order', 'settings'];

    protected $attributes = ['is_visible' => true, 'sort_order' => 0];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    protected function casts(): array
    {
        return ['is_visible' => 'boolean', 'sort_order' => 'integer', 'settings' => 'array'];
    }
}
