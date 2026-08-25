<?php

namespace App\Models;

use Database\Factories\AnnouncementFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    /** @use HasFactory<AnnouncementFactory> */
    use HasFactory;

    protected $fillable = ['title', 'slug', 'content', 'publish_date', 'expiration_date', 'status'];

    protected $attributes = ['status' => 'active'];

    protected function casts(): array
    {
        return ['publish_date' => 'date:Y-m-d', 'expiration_date' => 'date:Y-m-d'];
    }
}
