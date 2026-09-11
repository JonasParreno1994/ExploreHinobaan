<?php

use App\Models\Enterprise;
use App\Models\EnterpriseMenuItem;
use App\Models\EnterpriseSection;
use App\Models\EnterpriseTourItinerary;
use App\Models\EnterpriseTourPackage;
use App\Models\EnterpriseType;
use App\Models\EnterpriseWebsite;
use App\Models\LocalProduct;
use App\Models\ProductCategory;
use App\Models\Role;
use App\Models\User;
use App\Services\EnterpriseWebsiteModuleRegistry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function micrositePartner(string $status = 'approved'): array
{
    $role = Role::query()->firstOrCreate(['name' => 'Tourism Enterprise'], ['description' => 'Tourism enterprise partner']);
    $user = User::factory()->for($role)->create();
    $type = EnterpriseType::query()->firstOrCreate(['slug' => 'resort'], ['name' => 'Resort', 'description' => 'Resort', 'status' => 'active']);
    $enterprise = Enterprise::factory()->for($user)->for($type)->create(['application_status' => $status]);

    return [$user, $enterprise];
}

test('partner website index only lists owned approved enterprises', function () {
    [$user, $approved] = micrositePartner();
    Enterprise::factory()->for($user)->create(['application_status' => 'pending']);
    Enterprise::factory()->create(['application_status' => 'approved']);

    $this->actingAs($user)->get(route('partner.websites.index'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/websites/index')
        ->has('enterprises', 1)
        ->where('enterprises.0.id', $approved->id));
});

test('opening the website dashboard creates the common cms foundation', function () {
    [$user, $enterprise] = micrositePartner();

    $this->actingAs($user)->get(route('partner.websites.dashboard', $enterprise))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/websites/dashboard')
        ->where('enterprise.id', $enterprise->id)
        ->where('website.is_published', false)
        ->where('completionPercentage', 17));

    expect($enterprise->microsite)->toBeInstanceOf(EnterpriseWebsite::class)
        ->and($enterprise->sections()->pluck('section_type')->all())->toContain('about', 'amenities', 'home', 'policies', 'builder_hero', 'builder_about', 'builder_rooms', 'builder_gallery', 'builder_location');
});

test('website modules are selected from the enterprise type', function (string $typeName, string $expectedModule, string $unexpectedModule) {
    $type = EnterpriseType::factory()->create(['name' => $typeName]);
    $enterprise = Enterprise::factory()->for($type)->create(['application_status' => 'approved']);
    $modules = app(EnterpriseWebsiteModuleRegistry::class)->forEnterprise($enterprise);

    expect(collect($modules)->pluck('key'))
        ->toContain($expectedModule)
        ->not->toContain($unexpectedModule);
})->with([
    'resort' => ['Resort', 'swimming_pools', 'menu'],
    'hotel' => ['Hotel', 'suites', 'cottages'],
    'homestay' => ['Homestay', 'host_profile', 'featured_dishes'],
    'cafe' => ['Cafe', 'featured_drinks', 'rooms'],
    'restaurant' => ['Restaurant', 'featured_dishes', 'suites'],
    'seller' => ['Local Product Seller', 'products', 'rooms'],
    'recreation' => ['Recreation Provider', 'safety_information', 'menu'],
    'guide' => ['Tour Guide', 'specializations', 'swimming_pools'],
    'operator' => ['Tour Operator', 'itineraries', 'featured_drinks'],
]);

test('a partner cannot open a module belonging to another enterprise type', function () {
    $role = Role::query()->firstOrCreate(['name' => 'Tourism Enterprise'], ['description' => 'Tourism enterprise partner']);
    $user = User::factory()->for($role)->create();
    $cafeType = EnterpriseType::factory()->create(['name' => 'Cafe']);
    $cafe = Enterprise::factory()->for($user)->for($cafeType)->create(['application_status' => 'approved']);

    $this->actingAs($user)->get(route('partner.websites.dashboard', $cafe))->assertSuccessful();
    $this->actingAs($user)->get(route('partner.websites.sections.edit', [$cafe, 'module_featured_drinks']))->assertSuccessful();
    $this->actingAs($user)->get(route('partner.websites.sections.edit', [$cafe, 'module_host_profile']))->assertNotFound();
});

test('cafe owners can manage menu records but other enterprise types cannot', function () {
    $role = Role::query()->firstOrCreate(['name' => 'Tourism Enterprise'], ['description' => 'Tourism enterprise partner']);
    $user = User::factory()->for($role)->create();
    $cafeType = EnterpriseType::factory()->create(['name' => 'Cafe']);
    $cafe = Enterprise::factory()->for($user)->for($cafeType)->create(['application_status' => 'approved']);

    $this->actingAs($user)->post(route('partner.websites.menu.categories.store', $cafe), [
        'name' => 'Coffee',
        'description' => 'Hot and cold drinks',
        'sort_order' => 10,
        'is_active' => true,
    ])->assertRedirect()->assertSessionHasNoErrors();
    $category = $cafe->menuCategories()->firstOrFail();

    $this->actingAs($user)->post(route('partner.websites.menu.items.store', $cafe), [
        'enterprise_menu_category_id' => $category->id,
        'name' => 'Hinoba-an Blend',
        'description' => 'Locally inspired coffee',
        'price' => 120,
        'is_available' => true,
        'is_featured' => true,
        'is_best_seller' => true,
        'is_new' => false,
        'sort_order' => 10,
    ])->assertRedirect()->assertSessionHasNoErrors();

    expect(EnterpriseMenuItem::query()->whereBelongsTo($cafe)->firstOrFail()->name)->toBe('Hinoba-an Blend');

    [$resortOwner, $resort] = micrositePartner();
    $this->actingAs($resortOwner)->get(route('partner.websites.menu', $resort))->assertNotFound();
});

test('tour operators can build packages with ordered itinerary items', function () {
    $role = Role::query()->firstOrCreate(['name' => 'Tourism Enterprise'], ['description' => 'Tourism enterprise partner']);
    $user = User::factory()->for($role)->create();
    $type = EnterpriseType::factory()->create(['name' => 'Tour Operator']);
    $enterprise = Enterprise::factory()->for($user)->for($type)->create(['application_status' => 'approved']);

    $this->actingAs($user)->post(route('partner.websites.tours.packages.store', $enterprise), [
        'name' => 'Southern Hinoba-an Day Tour',
        'description' => 'A guided coastal experience.',
        'rate' => 2500,
        'inclusions' => 'Guide and transport',
        'exclusions' => 'Meals',
        'is_available' => true,
        'is_featured' => true,
    ])->assertRedirect()->assertSessionHasNoErrors();
    $package = EnterpriseTourPackage::query()->whereBelongsTo($enterprise)->firstOrFail();

    $this->actingAs($user)->post(route('partner.websites.tours.itineraries.store', $enterprise), [
        'enterprise_tour_package_id' => $package->id,
        'time' => '08:30',
        'activity' => 'Coastal departure',
        'destination' => 'Hinoba-an coastline',
        'description' => 'Meet the guide and begin the tour.',
        'sort_order' => 10,
    ])->assertRedirect()->assertSessionHasNoErrors();

    expect(EnterpriseTourItinerary::query()->whereBelongsTo($package, 'package')->firstOrFail()->activity)->toBe('Coastal departure');
});

test('partners cannot manage another or pending enterprise website', function () {
    [$user] = micrositePartner();
    [, $otherEnterprise] = micrositePartner();
    [, $pendingEnterprise] = micrositePartner('pending');

    $this->actingAs($user)->get(route('partner.websites.dashboard', $otherEnterprise))->assertForbidden();
    $this->actingAs($pendingEnterprise->user)->get(route('partner.websites.dashboard', $pendingEnterprise))->assertForbidden();
});

test('microsite cms supports future active enterprise types through the module matrix', function () {
    $role = Role::query()->firstOrCreate(['name' => 'Tourism Enterprise'], ['description' => 'Tourism enterprise partner']);
    $user = User::factory()->for($role)->create();
    $type = EnterpriseType::factory()->create(['name' => 'Dive Center', 'slug' => 'dive-center', 'website_modules' => ['activities', 'reservations']]);
    $enterprise = Enterprise::factory()->for($user)->for($type)->create(['application_status' => 'approved']);

    $this->actingAs($user)->get(route('partner.websites.index'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page->has('enterprises', 1));
    $this->actingAs($user)->get(route('partner.websites.dashboard', $enterprise))->assertSuccessful();
});

test('partner can update common sections and publish the website', function () {
    [$user, $enterprise] = micrositePartner();
    $this->actingAs($user)->get(route('partner.websites.dashboard', $enterprise))->assertSuccessful();

    $this->actingAs($user)->put(route('partner.websites.sections.update', [$enterprise, 'about']), [
        'title' => 'Our Story',
        'subtitle' => 'Rooted in Hinoba-an',
        'content' => 'A locally owned tourism enterprise serving our community.',
        'is_visible' => true,
    ])->assertRedirect()->assertSessionHasNoErrors();

    expect(EnterpriseSection::query()->whereBelongsTo($enterprise)->where('section_type', 'about')->firstOrFail()->title)->toBe('Our Story');

    $this->actingAs($user)->patch(route('partner.websites.publish', $enterprise), ['is_published' => true])->assertRedirect();
    expect($enterprise->microsite->refresh()->is_published)->toBeTrue()
        ->and($enterprise->microsite->published_at)->not->toBeNull();
});

test('published microsite data extends the existing public enterprise page', function () {
    [, $enterprise] = micrositePartner();
    $website = EnterpriseWebsite::factory()->for($enterprise)->create(['is_published' => true, 'seo_title' => 'Stay at Hinoba-an Resort']);
    EnterpriseSection::factory()->for($enterprise)->create(['section_type' => 'about', 'title' => 'Our Coastal Story']);

    $this->get(route('enterprises.show', $enterprise->slug))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('enterprises/show')
        ->where('enterprise.id', $enterprise->id)
        ->where('enterprise.microsite.id', $website->id)
        ->where('enterprise.sections.0.title', 'Our Coastal Story'));
});

test('draft microsite content is not exposed on the public enterprise page', function () {
    [, $enterprise] = micrositePartner();
    EnterpriseWebsite::factory()->for($enterprise)->create(['is_published' => false]);
    EnterpriseSection::factory()->for($enterprise)->create(['section_type' => 'about', 'content' => 'Private draft copy']);
    $enterprise->socialLinks()->create(['platform' => 'facebook', 'url' => 'https://facebook.com/private-draft']);

    $this->get(route('enterprises.show', $enterprise->slug))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->where('enterprise.microsite', null)
        ->has('enterprise.sections', 0)
        ->has('enterprise.social_links', 0)
        ->has('enterprise.local_products', 0));
});

test('published local seller products appear on its public microsite', function () {
    $type = EnterpriseType::factory()->create(['name' => 'Local Product Seller']);
    $enterprise = Enterprise::factory()->for($type)->create(['application_status' => 'approved']);
    $category = ProductCategory::factory()->create(['name' => 'Food', 'slug' => 'food', 'status' => 'active']);
    EnterpriseWebsite::factory()->for($enterprise)->create(['is_published' => true]);
    LocalProduct::factory()->for($enterprise)->for($category, 'category')->create(['status' => 'published', 'name' => 'Hinoba-an Coffee', 'slug' => 'hinobaan-coffee', 'description' => 'Local coffee', 'price' => 150]);
    LocalProduct::factory()->for($enterprise)->for($category, 'category')->create(['status' => 'pending_review', 'name' => 'Draft Product', 'slug' => 'draft-product', 'description' => 'Draft', 'price' => 100]);

    $this->get(route('enterprises.show', $enterprise))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->has('enterprise.local_products', 1)
        ->where('enterprise.local_products.0.name', 'Hinoba-an Coffee'));
});

test('published local seller products remain visible before a website cms record exists', function () {
    $type = EnterpriseType::factory()->create(['name' => 'Local Product Seller']);
    $enterprise = Enterprise::factory()->for($type)->create(['application_status' => 'approved']);
    $category = ProductCategory::factory()->create(['name' => 'Food', 'slug' => 'food', 'status' => 'active']);
    LocalProduct::factory()->for($enterprise)->for($category, 'category')->create([
        'status' => 'published',
        'name' => 'Daisy Product',
        'slug' => 'daisy-product',
        'description' => 'A published local product.',
        'price' => 150,
    ]);

    $this->get(route('enterprises.show', $enterprise))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->where('enterprise.microsite', null)
        ->has('enterprise.local_products', 1)
        ->where('enterprise.local_products.0.name', 'Daisy Product'));
});

test('published local seller products remain visible while the website cms is a draft', function () {
    $type = EnterpriseType::factory()->create(['name' => 'Local Product Seller']);
    $enterprise = Enterprise::factory()->for($type)->create(['application_status' => 'approved']);
    $category = ProductCategory::factory()->create(['name' => 'Food', 'slug' => 'draft-site-food', 'status' => 'active']);
    EnterpriseWebsite::factory()->for($enterprise)->create(['is_published' => false]);
    LocalProduct::factory()->for($enterprise)->for($category, 'category')->create([
        'status' => 'published',
        'name' => 'Daisy Product',
        'slug' => 'daisy-product-with-draft-site',
        'description' => 'A published product managed outside the website draft.',
        'price' => 150,
    ]);

    $this->get(route('enterprises.show', $enterprise))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->where('enterprise.microsite', null)
        ->has('enterprise.local_products', 1)
        ->where('enterprise.local_products.0.name', 'Daisy Product'));
});

test('public enterprise page is composed from reusable microsite sections', function () {
    $source = file_get_contents(resource_path('js/pages/enterprises/show.tsx'));

    expect($source)
        ->toContain('<EnterpriseHero enterprise={enterprise} />')
        ->toContain('<EnterpriseNavigation enterprise={enterprise} />')
        ->toContain('<EnterpriseGallery enterprise={enterprise} />')
        ->toContain('<EnterpriseMap enterprise={enterprise} />')
        ->toContain('<EnterpriseFooter enterprise={enterprise} />')
        ->not->toContain('About the Enterprise');
    expect($source)->toContain('defaultHomepageBlocks')->not->toContain('Object.entries(sectionComponents)');
});

test('homepage builder identifies authoritative content sources', function () {
    $source = file_get_contents(resource_path('js/pages/tourism-enterprise/websites/home.tsx'));

    expect($source)
        ->toContain('One source for every business record')
        ->toContain('Manage Content in {destination.label}')
        ->toContain("builder_rooms: 'rooms'")
        ->toContain("builder_products: { href: route('partner.products.index')")
        ->toContain("builder_menu: { href: route('partner.websites.menu'")
        ->toContain("builder_tour_packages: { href: route('partner.websites.tours'")
        ->not->toContain("['builder_hero', 'builder_about'].includes(section.section_type)");
});

test('unsupported template and unsafe website content are rejected', function () {
    [$user, $enterprise] = micrositePartner();
    $this->actingAs($user)->get(route('partner.websites.dashboard', $enterprise))->assertSuccessful();

    $this->actingAs($user)->put(route('partner.websites.appearance.update', $enterprise), [
        'template' => '<script>alert(1)</script>',
        'tagline' => 'Welcome',
        'primary_color' => 'red; background:url(test)',
        'secondary_color' => '#F97316',
        'accent_color' => '#FBBF24',
    ])->assertSessionHasErrors(['template', 'primary_color']);
});
