<?php

namespace App\Services;

use App\Models\Enterprise;

class EnterpriseWebsiteModuleRegistry
{
    /** @var array<string, list<array{key: string, label: string, destination: string}>> */
    private const MODULES = [
        'Resort' => [
            ['key' => 'rooms', 'label' => 'Rooms', 'destination' => 'services'],
            ['key' => 'cottages', 'label' => 'Cottages', 'destination' => 'services'],
            ['key' => 'swimming_pools', 'label' => 'Swimming Pools', 'destination' => 'services'],
            ['key' => 'activities', 'label' => 'Activities', 'destination' => 'services'],
            ['key' => 'packages', 'label' => 'Packages', 'destination' => 'services'],
            ['key' => 'reservations', 'label' => 'Reservations', 'destination' => 'reservations'],
        ],
        'Hotel' => [
            ['key' => 'rooms', 'label' => 'Rooms', 'destination' => 'services'],
            ['key' => 'suites', 'label' => 'Suites', 'destination' => 'services'],
            ['key' => 'dining', 'label' => 'Dining', 'destination' => 'section'],
            ['key' => 'reservations', 'label' => 'Reservations', 'destination' => 'reservations'],
        ],
        'Homestay' => [
            ['key' => 'rooms', 'label' => 'Rooms', 'destination' => 'services'],
            ['key' => 'host_profile', 'label' => 'Host Profile', 'destination' => 'section'],
            ['key' => 'house_rules', 'label' => 'House Rules', 'destination' => 'section'],
            ['key' => 'local_experiences', 'label' => 'Local Experiences', 'destination' => 'section'],
            ['key' => 'reservations', 'label' => 'Reservations', 'destination' => 'reservations'],
        ],
        'Cafe' => [
            ['key' => 'menu', 'label' => 'Menu', 'destination' => 'menu'],
            ['key' => 'menu_categories', 'label' => 'Menu Categories', 'destination' => 'menu'],
            ['key' => 'featured_drinks', 'label' => 'Featured Drinks', 'destination' => 'section'],
            ['key' => 'featured_food', 'label' => 'Featured Food', 'destination' => 'section'],
            ['key' => 'promotions', 'label' => 'Promotions', 'destination' => 'section'],
            ['key' => 'opening_hours', 'label' => 'Opening Hours', 'destination' => 'section'],
            ['key' => 'reservations', 'label' => 'Visit Reservations', 'destination' => 'reservations'],
        ],
        'Restaurant' => [
            ['key' => 'menu', 'label' => 'Menu', 'destination' => 'menu'],
            ['key' => 'menu_categories', 'label' => 'Menu Categories', 'destination' => 'menu'],
            ['key' => 'specialties', 'label' => 'Specialties', 'destination' => 'section'],
            ['key' => 'featured_dishes', 'label' => 'Featured Dishes', 'destination' => 'section'],
            ['key' => 'dining_facilities', 'label' => 'Dining Facilities', 'destination' => 'section'],
            ['key' => 'opening_hours', 'label' => 'Opening Hours', 'destination' => 'section'],
            ['key' => 'reservations', 'label' => 'Reservations', 'destination' => 'reservations'],
        ],
        'Local Product Seller' => [
            ['key' => 'product_categories', 'label' => 'Product Categories', 'destination' => 'products'],
            ['key' => 'products', 'label' => 'Products', 'destination' => 'products'],
            ['key' => 'featured_products', 'label' => 'Featured Products', 'destination' => 'products'],
            ['key' => 'promotions', 'label' => 'Promotions', 'destination' => 'section'],
            ['key' => 'pickup_information', 'label' => 'Pickup Information', 'destination' => 'section'],
            ['key' => 'delivery_information', 'label' => 'Delivery Information', 'destination' => 'section'],
            ['key' => 'orders', 'label' => 'Orders', 'destination' => 'product-orders'],
        ],
        'Recreation Provider' => [
            ['key' => 'activities', 'label' => 'Activities', 'destination' => 'services'],
            ['key' => 'activity_packages', 'label' => 'Activity Packages', 'destination' => 'services'],
            ['key' => 'rates', 'label' => 'Rates', 'destination' => 'section'],
            ['key' => 'schedules', 'label' => 'Schedules', 'destination' => 'section'],
            ['key' => 'requirements', 'label' => 'Requirements', 'destination' => 'section'],
            ['key' => 'safety_information', 'label' => 'Safety Information', 'destination' => 'section'],
            ['key' => 'reservations', 'label' => 'Reservations', 'destination' => 'reservations'],
        ],
        'Tour Guide' => [
            ['key' => 'guide_profile', 'label' => 'Guide Profile', 'destination' => 'section'],
            ['key' => 'specializations', 'label' => 'Specializations', 'destination' => 'guide'],
            ['key' => 'areas_covered', 'label' => 'Areas Covered', 'destination' => 'section'],
            ['key' => 'languages', 'label' => 'Languages', 'destination' => 'section'],
            ['key' => 'accreditations', 'label' => 'Accreditations', 'destination' => 'section'],
            ['key' => 'tour_packages', 'label' => 'Tour Packages', 'destination' => 'tours'],
            ['key' => 'availability', 'label' => 'Availability', 'destination' => 'section'],
            ['key' => 'booking', 'label' => 'Booking', 'destination' => 'reservations'],
        ],
        'Tour Operator' => [
            ['key' => 'tour_packages', 'label' => 'Tour Packages', 'destination' => 'tours'],
            ['key' => 'destinations', 'label' => 'Destinations', 'destination' => 'tours'],
            ['key' => 'itineraries', 'label' => 'Itineraries', 'destination' => 'tours'],
            ['key' => 'rates', 'label' => 'Rates', 'destination' => 'tours'],
            ['key' => 'inclusions', 'label' => 'Inclusions', 'destination' => 'tours'],
            ['key' => 'exclusions', 'label' => 'Exclusions', 'destination' => 'tours'],
            ['key' => 'schedules', 'label' => 'Schedules', 'destination' => 'tours'],
            ['key' => 'reservations', 'label' => 'Reservations', 'destination' => 'reservations'],
        ],
    ];

    /** @return list<array{key: string, label: string, destination: string}> */
    public function catalog(): array
    {
        return collect(self::MODULES)->flatten(1)->unique('key')->sortBy('label')->values()->all();
    }

    /** @return list<array{key: string, label: string, destination: string}> */
    public function forEnterprise(Enterprise $enterprise): array
    {
        $enterprise->loadMissing('enterpriseType:id,name,status,website_modules');

        $defaults = self::MODULES[$enterprise->enterpriseType?->name] ?? [];
        $configuredKeys = $enterprise->enterpriseType?->website_modules;

        if ($configuredKeys === null) {
            return $defaults;
        }

        return collect($this->catalog())->whereIn('key', $configuredKeys)->values()->all();
    }

    /** @return list<string> */
    public function defaultsForType(string $typeName): array
    {
        return collect(self::MODULES[$typeName] ?? [])->pluck('key')->all();
    }

    /** @return array{key: string, label: string, destination: string}|null */
    public function find(Enterprise $enterprise, string $key): ?array
    {
        return collect($this->forEnterprise($enterprise))->firstWhere('key', $key);
    }

    /** @return array<string, array{title: string, sort_order: int}> */
    public function contentSections(Enterprise $enterprise): array
    {
        return collect($this->forEnterprise($enterprise))
            ->where('destination', 'section')
            ->values()
            ->mapWithKeys(fn (array $module, int $index): array => [
                'module_'.$module['key'] => ['title' => $module['label'], 'sort_order' => 100 + ($index * 10)],
            ])->all();
    }
}
