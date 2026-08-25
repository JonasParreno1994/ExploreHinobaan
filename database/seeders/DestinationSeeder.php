<?php

namespace Database\Seeders;

use App\Models\Barangay;
use App\Models\Destination;
use App\Models\TourismCategory;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([TourismCategorySeeder::class, BarangaySeeder::class]);

        $destinations = [
            [
                'name' => 'Obong Caves',
                'category' => 'Caves',
                'barangay' => 'Bacuyangan',
                'address' => 'Ubong, Barangay Bacuyangan, Hinoba-an, Negros Occidental',
            ],
            [
                'name' => 'Bolila Island',
                'category' => 'Islands',
                'barangay' => 'Asia',
                'address' => 'Barangay Asia, Hinoba-an, Negros Occidental',
            ],
            [
                'name' => 'Alanaban Falls',
                'category' => 'Waterfalls',
                'barangay' => 'San Rafael',
                'address' => 'Purok Alanaban, Barangay San Rafael, Hinoba-an, Negros Occidental',
            ],
        ];

        foreach ($destinations as $destination) {
            Destination::query()->updateOrCreate(
                ['name' => $destination['name']],
                [
                    'category_id' => TourismCategory::query()->where('name', $destination['category'])->valueOrFail('id'),
                    'barangay_id' => Barangay::query()->where('name', $destination['barangay'])->valueOrFail('id'),
                    'address' => $destination['address'],
                    'latitude' => null,
                    'longitude' => null,
                    'status' => 'published',
                    'is_featured' => true,
                ],
            );
        }
    }
}
