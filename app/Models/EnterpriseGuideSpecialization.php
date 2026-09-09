<?php

namespace App\Models;

use Database\Factories\EnterpriseGuideSpecializationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnterpriseGuideSpecialization extends Model
{
    /** @use HasFactory<EnterpriseGuideSpecializationFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'name', 'description', 'years_experience', 'is_active'];

    protected $attributes = ['is_active' => true];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    protected function casts(): array
    {
        return ['years_experience' => 'integer', 'is_active' => 'boolean'];
    }
}
