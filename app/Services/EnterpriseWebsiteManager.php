<?php

namespace App\Services;

use App\Models\Enterprise;
use App\Models\EnterpriseWebsite;
use App\Models\User;

class EnterpriseWebsiteManager
{
    public function __construct(private EnterpriseWebsiteModuleRegistry $modules) {}

    /** @var array<string, array{title: string, sort_order: int}> */
    public const SECTIONS = [
        'home' => ['title' => 'Home Page', 'sort_order' => 10],
        'about' => ['title' => 'About Us', 'sort_order' => 20],
        'amenities' => ['title' => 'Amenities / Facilities', 'sort_order' => 30],
        'policies' => ['title' => 'Policies', 'sort_order' => 40],
    ];

    public function getOrCreate(User $user, Enterprise $enterprise): EnterpriseWebsite
    {
        $enterprise->loadMissing('enterpriseType:id,name,status,website_modules');
        abort_unless(
            $enterprise->user_id === $user->id
            && $enterprise->application_status === 'approved'
            && $enterprise->enterpriseType?->status === 'active',
            403,
        );

        $website = $enterprise->microsite()->firstOrCreate();
        foreach (self::SECTIONS as $type => $defaults) {
            $enterprise->sections()->firstOrCreate(['section_type' => $type], $defaults);
        }
        foreach ($this->modules->contentSections($enterprise) as $type => $defaults) {
            $enterprise->sections()->firstOrCreate(['section_type' => $type], $defaults);
        }
        foreach ($this->homepageSections($enterprise) as $type => $defaults) {
            $enterprise->sections()->firstOrCreate(['section_type' => 'builder_'.$type], $defaults);
        }
        $enterprise->setAttribute('website_modules', $this->modules->forEnterprise($enterprise));

        return $website->load('enterprise.sections', 'enterprise.galleryImages', 'enterprise.socialLinks');
    }

    /** @return array<string, array{title: string, sort_order: int}> */
    public function homepageSections(Enterprise $enterprise): array
    {
        $keys = collect($this->modules->forEnterprise($enterprise))->pluck('key');
        $specialized = match (true) {
            $keys->contains('rooms') => ['rooms' => 'Rooms'],
            $keys->contains('menu') => ['menu' => 'Menu'],
            $keys->contains('products') => ['products' => 'Products'],
            $keys->contains('activities') => ['activities' => 'Activities'],
            $keys->contains('tour_packages') => ['tour_packages' => 'Tour Packages'],
            default => ['featured_services' => 'Featured Services'],
        };
        $sections = ['hero' => 'Hero Banner', 'about' => 'Welcome / About', ...$specialized, 'amenities' => 'Amenities', 'gallery' => 'Gallery', 'reviews' => 'Reviews', 'location' => 'Location', 'contact' => 'Contact'];
        $order = 10;

        return collect($sections)->mapWithKeys(function (string $title, string $key) use (&$order): array {
            $currentOrder = $order;
            $order += 10;

            return [$key => ['title' => $title, 'sort_order' => $currentOrder]];
        })->all();
    }
}
