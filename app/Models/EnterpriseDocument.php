<?php

namespace App\Models;

use Database\Factories\EnterpriseDocumentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnterpriseDocument extends Model
{
    /** @use HasFactory<EnterpriseDocumentFactory> */
    use HasFactory;

    protected $fillable = ['enterprise_id', 'document_type', 'document_number', 'file_path', 'expiration_date', 'verification_status', 'remarks'];

    protected $attributes = ['verification_status' => 'pending'];

    protected $appends = ['file_url'];

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    protected function casts(): array
    {
        return ['expiration_date' => 'date:Y-m-d'];
    }

    protected function getFileUrlAttribute(): string
    {
        return route('secure-files.enterprise-documents.show', $this);
    }
}
