<?php

use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\EnterpriseWebsite;
use App\Models\LocalProduct;
use App\Models\ProductCategory;
use App\Models\Role;
use App\Models\User;
use Laravel\Dusk\Browser;

test('direct navigation and refresh initialize Inertia without JavaScript errors', function () {
    $enterpriseType = EnterpriseType::factory()->create(['name' => 'Local Product Seller']);
    $enterprise = Enterprise::factory()->for($enterpriseType)->create([
        'business_name' => 'Browser Test Enterprise',
        'application_status' => 'approved',
        'approved_at' => now(),
    ]);
    EnterpriseWebsite::factory()->for($enterprise)->create([
        'is_published' => true,
        'published_at' => now(),
    ]);
    $category = ProductCategory::factory()->create();
    $product = LocalProduct::create([
        'enterprise_id' => $enterprise->id,
        'product_category_id' => $category->id,
        'name' => 'Browser Test Product',
        'slug' => 'browser-test-product',
        'description' => 'A product used to verify frontend initialization.',
        'price' => 100,
        'selling_unit' => 'piece',
        'stock_quantity' => 5,
        'status' => 'published',
        'approved_at' => now(),
    ]);
    $administrator = User::factory()
        ->for(Role::factory()->create(['name' => 'Administrator']))
        ->create();

    $this->browse(function (Browser $browser) use ($administrator, $enterprise, $product) {
        $assertStablePage = function (string $path, string $expectedText) use ($browser): void {
            $browser->visit($path)
                ->waitUntil('document.readyState === "complete"')
                ->assertSee($expectedText)
                ->assertScript('Boolean(document.querySelector("[data-page]"))', true);

            assertBrowserHasNoJavascriptErrors($browser, "direct visit to {$path}");

            $browser->refresh()
                ->waitUntil('document.readyState === "complete"')
                ->assertSee($expectedText)
                ->assertScript('Boolean(document.querySelector("[data-page]"))', true);

            assertBrowserHasNoJavascriptErrors($browser, "refresh of {$path}");
        };

        $assertStablePage(route('home', absolute: false), 'Explore Hinoba-an');
        $assertStablePage(route('enterprises.show', $enterprise, absolute: false), 'Browser Test Enterprise');
        $assertStablePage(route('local-products.show', $product, absolute: false), 'Browser Test Product');
        $assertStablePage(route('interactive-map', absolute: false), 'Explore Hinoba-an');

        $browser->loginAs($administrator);
        $assertStablePage(route('dashboard', absolute: false), 'Tourism Operations Dashboard');
    });
});

function assertBrowserHasNoJavascriptErrors(Browser $browser, string $context): void
{
    $errors = collect($browser->driver->manage()->getLog('browser'))
        ->filter(fn (array $entry): bool => ($entry['level'] ?? null) === 'SEVERE' && ($entry['source'] ?? null) === 'javascript')
        ->pluck('message')
        ->all();

    expect($errors, "JavaScript errors detected during {$context}")->toBeEmpty();
}
