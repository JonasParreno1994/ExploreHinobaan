<?php

namespace App\Models;

use Database\Factories\EnterpriseTourItineraryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnterpriseTourItinerary extends Model
{
    /** @use HasFactory<EnterpriseTourItineraryFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_tour_package_id', 'time', 'activity', 'destination', 'description', 'sort_order'];

    protected $attributes = ['sort_order' => 0];

    public function package(): BelongsTo
    {
        return $this->belongsTo(EnterpriseTourPackage::class, 'enterprise_tour_package_id');
    }

    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }
}
