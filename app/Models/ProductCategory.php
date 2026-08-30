<?php

namespace App\Models;

use Database\Factories\ProductCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductCategory extends Model
{
    /** @use HasFactory<ProductCategoryFactory> */
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'status'];

    protected $attributes = ['status' => 'active'];

    public function products(): HasMany
    {
        return $this->hasMany(LocalProduct::class);
    }
}
