<?php

namespace App\Models;

use Database\Factories\TourismCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class TourismCategory extends Model
{
    /** @use HasFactory<TourismCategoryFactory> */
    use HasFactory;

    protected $fillable = ['name', 'description', 'icon', 'status'];

    protected $attributes = ['status' => 'active'];

    protected static function booted(): void
    {
        static::saving(function (TourismCategory $category): void {
            $category->slug = Str::slug($category->name);
        });
    }

    public function destinations(): HasMany
    {
        return $this->hasMany(Destination::class, 'category_id');
    }
}
