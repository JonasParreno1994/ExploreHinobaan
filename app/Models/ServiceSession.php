<?php

namespace App\Models;

use Database\Factories\ServiceSessionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceSession extends Model
{
    /** @use HasFactory<ServiceSessionFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_service_id', 'name', 'start_time', 'end_time', 'price', 'capacity', 'is_active'];

    protected $attributes = ['is_active' => true];

    public function service(): BelongsTo
    {
        return $this->belongsTo(EnterpriseService::class, 'enterprise_service_id');
    }

    public function reservationItems(): HasMany
    {
        return $this->hasMany(ReservationItem::class);
    }

    protected function casts(): array
    {
        return ['price' => 'decimal:2', 'capacity' => 'integer', 'is_active' => 'boolean'];
    }
}
