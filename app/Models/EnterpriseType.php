<?php

namespace App\Models;

use Database\Factories\EnterpriseTypeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class EnterpriseType extends Model
{
    /** @use HasFactory<EnterpriseTypeFactory> */
    use HasFactory;

    protected $fillable = ['name', 'description', 'status', 'website_modules'];

    protected $attributes = ['status' => 'active'];

    protected static function booted(): void
    {
        static::saving(function (EnterpriseType $enterpriseType): void {
            $enterpriseType->slug = Str::slug($enterpriseType->name);
        });
    }

    public function enterprises(): HasMany
    {
        return $this->hasMany(Enterprise::class);
    }

    protected function casts(): array
    {
        return ['website_modules' => 'array'];
    }
}
