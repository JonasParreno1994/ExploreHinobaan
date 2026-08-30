<?php

namespace App\Models;

use Database\Factories\WhyVisitSectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhyVisitSection extends Model
{
    /** @use HasFactory<WhyVisitSectionFactory> */
    use HasFactory;

    protected $fillable = ['eyebrow', 'title', 'subtitle', 'cards', 'status'];

    protected $attributes = ['status' => 'active'];

    protected function casts(): array
    {
        return ['cards' => 'array'];
    }
}
