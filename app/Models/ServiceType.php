<?php

namespace App\Models;

use Database\Factories\ServiceTypeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceType extends Model
{
    /** @use HasFactory<ServiceTypeFactory> */
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'status'];

    protected $attributes = ['status' => 'active'];

    public function services(): HasMany
    {
        return $this->hasMany(EnterpriseService::class);
    }
}
