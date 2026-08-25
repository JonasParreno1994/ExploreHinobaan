<?php

namespace App\Models;

use Database\Factories\ServiceAvailabilityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceAvailability extends Model
{
    /** @use HasFactory<ServiceAvailabilityFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_service_id', 'date', 'available_quantity', 'status', 'notes'];

    protected $attributes = ['status' => 'available'];

    public function service(): BelongsTo
    {
        return $this->belongsTo(EnterpriseService::class, 'enterprise_service_id');
    }

    protected function casts(): array
    {
        return ['date' => 'date:Y-m-d', 'available_quantity' => 'integer'];
    }
}
