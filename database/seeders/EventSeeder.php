<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Pagbana-ag Festival', 'Pagbana-ag Huba-Huba Colorfest'] as $title) {
            Event::query()->updateOrCreate(
                ['title' => $title],
                [
                    'slug' => Str::slug($title),
                    'event_type' => 'Festival',
                    'venue' => 'Municipality of Hinoba-an',
                    'start_date' => null,
                    'end_date' => null,
                    'status' => 'published',
                    'is_featured' => true,
                ],
            );
        }
    }
}
