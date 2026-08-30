<?php

namespace App\Models;

use Database\Factories\DailyTouristReportFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyTouristReport extends Model
{
    /** @use HasFactory<DailyTouristReportFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'report_date', 'status', 'submitted_by', 'submitted_at', 'verified_by', 'verified_at', 'admin_notes'];

    protected $attributes = ['status' => 'submitted'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    protected function casts(): array
    {
        return ['report_date' => 'date:Y-m-d', 'submitted_at' => 'datetime', 'verified_at' => 'datetime'];
    }
}
