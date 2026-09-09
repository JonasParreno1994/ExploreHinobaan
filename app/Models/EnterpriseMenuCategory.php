<?php

namespace App\Models;

use Database\Factories\EnterpriseMenuCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EnterpriseMenuCategory extends Model
{
    /** @use HasFactory<EnterpriseMenuCategoryFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'name', 'description', 'sort_order', 'is_active'];

    protected $attributes = ['sort_order' => 0, 'is_active' => true];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(EnterpriseMenuItem::class)->orderBy('sort_order');
    }

    protected function casts(): array
    {
        return ['sort_order' => 'integer', 'is_active' => 'boolean'];
    }
}
