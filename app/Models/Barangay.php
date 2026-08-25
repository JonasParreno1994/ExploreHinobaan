<?php

namespace App\Models;

use Database\Factories\BarangayFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Barangay extends Model
{
    /** @use HasFactory<BarangayFactory> */
    use HasFactory;

    protected $fillable = ['psgc_code', 'name', 'classification', 'population', 'status'];

    protected $attributes = ['status' => 'active'];

    protected static function booted(): void
    {
        static::saving(function (Barangay $barangay): void {
            $barangay->slug = Str::slug($barangay->name);
        });
    }

    protected function casts(): array
    {
        return ['population' => 'integer'];
    }

    public function destinations(): HasMany
    {
        return $this->hasMany(Destination::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function enterprises(): HasMany
    {
        return $this->hasMany(Enterprise::class);
    }
}
