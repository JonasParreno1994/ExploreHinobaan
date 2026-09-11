<?php

use App\Models\Enterprise;
use App\Models\EnterpriseOrderSetting;
use App\Models\EnterpriseType;
use App\Models\LocalProduct;
use App\Models\LocalProductOrder;
use App\Models\ProductCategory;
use App\Models\Role;
use App\Models\User;
use App\Notifications\NewPartnerActivityNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function localProductContext(): array
{
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $producerType = EnterpriseType::factory()->create(['name' => 'Local Product Seller']);
    $enterprise = Enterprise::factory()->for($owner)->for($producerType)->create(['application_status' => 'approved']);
    $category = ProductCategory::create(['name' => 'Food & Delicacies', 'slug' => 'food-delicacies']);

    return [$owner, $enterprise, $category];
}

test('approved producer can submit a product for administrator review', function () {
    [$owner, $enterprise, $category] = localProductContext();

    $this->actingAs($owner)->post(route('partner.products.store'), [
        'enterprise_id' => $enterprise->id,
        'product_category_id' => $category->id,
        'name' => 'Hinoba-an Tablea',
        'description' => 'Locally produced cacao tablea.',
        'price' => 180,
        'selling_unit' => 'pack',
        'stock_quantity' => 20,
        'is_made_to_order' => false,
    ])->assertRedirect(route('partner.products.index'))->assertSessionHasNoErrors();

    $product = LocalProduct::firstOrFail();
    expect($product->enterprise_id)->toBe($enterprise->id)->and($product->status)->toBe('pending_review');
});

test('other tourism enterprise types cannot access product management', function () {
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $resortType = EnterpriseType::factory()->create(['name' => 'Resort']);
    Enterprise::factory()->for($owner)->for($resortType)->create(['application_status' => 'approved']);

    $this->actingAs($owner)->get(route('partner.products.index'))->assertForbidden();
    $this->actingAs($owner)->get(route('partner.product-orders.index'))->assertForbidden();
});

test('producer cannot update another producers product', function () {
    [$owner, $enterprise, $category] = localProductContext();
    $otherProduct = LocalProduct::create(['enterprise_id' => Enterprise::factory()->create()->id, 'product_category_id' => $category->id, 'name' => 'Other Product', 'slug' => 'other-product', 'description' => 'Other', 'price' => 10, 'selling_unit' => 'piece', 'stock_quantity' => 2]);

    $this->actingAs($owner)->get(route('partner.products.edit', $otherProduct))->assertForbidden();
});

test('administrator can publish a product and it becomes publicly visible', function () {
    [, $enterprise, $category] = localProductContext();
    $product = LocalProduct::create(['enterprise_id' => $enterprise->id, 'product_category_id' => $category->id, 'name' => 'Local Coffee', 'slug' => 'local-coffee', 'description' => 'Coffee', 'price' => 250, 'selling_unit' => 'pack', 'stock_quantity' => 10, 'status' => 'pending_review']);
    $adminRole = Role::factory()->create(['name' => 'Administrator']);
    $admin = User::factory()->for($adminRole)->create();

    $this->actingAs($admin)->patch(route('admin.local-products.update', $product), ['status' => 'published'])->assertSessionHasNoErrors();
    expect($product->refresh()->status)->toBe('published')->and($product->approved_by)->toBe($admin->id);

    $this->get(route('local-products.show', $product))->assertSuccessful()->assertInertia(fn (Assert $page) => $page->component('local-products/show')->where('product.name', 'Local Coffee'));
});

test('public product order page uses the structured responsive checkout form', function () {
    $source = file_get_contents(resource_path('js/pages/local-products/show.tsx'));

    expect($source)
        ->toContain('Order details')
        ->toContain('Customer information')
        ->toContain('Fulfillment and payment')
        ->toContain('Order notes')
        ->toContain('lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)]')
        ->toContain("toLocaleString('en-PH')");
});

test('tourist order total and inventory are recalculated by the backend', function () {
    [$owner, $enterprise, $category] = localProductContext();
    Notification::fake();
    EnterpriseOrderSetting::create(['enterprise_id' => $enterprise->id, 'accepts_pickup' => true, 'accepts_delivery' => true, 'delivery_fee' => 50, 'accepts_cash_on_pickup' => true]);
    $product = LocalProduct::create(['enterprise_id' => $enterprise->id, 'product_category_id' => $category->id, 'name' => 'Banana Chips', 'slug' => 'banana-chips', 'description' => 'Chips', 'price' => 120, 'selling_unit' => 'pack', 'stock_quantity' => 5, 'status' => 'published']);

    $response = $this->post(route('local-product-orders.store'), ['product_id' => $product->id, 'quantity' => 2, 'customer_name' => 'Tourist Guest', 'customer_email' => 'tourist@example.com', 'customer_contact' => '09123456789', 'fulfillment_method' => 'delivery', 'delivery_address' => 'Barangay I, Hinoba-an', 'payment_method' => 'cash_on_pickup']);

    $order = LocalProductOrder::firstOrFail();
    $response->assertRedirect(route('local-product-orders.success', $order->order_number));
    expect($order->subtotal)->toBe('240.00')->and($order->total_amount)->toBe('290.00')->and($product->refresh()->stock_quantity)->toBe(3)->and($order->items()->first()->product_name)->toBe('Banana Chips');
    Notification::assertSentTo(
        $owner,
        NewPartnerActivityNotification::class,
        fn (NewPartnerActivityNotification $notification): bool => $notification->activityType === 'product_order'
            && $notification->reference === $order->order_number,
    );
});

test('tourist cannot order more than available stock', function () {
    [, $enterprise, $category] = localProductContext();
    EnterpriseOrderSetting::create(['enterprise_id' => $enterprise->id]);
    $product = LocalProduct::create(['enterprise_id' => $enterprise->id, 'product_category_id' => $category->id, 'name' => 'Souvenir', 'slug' => 'souvenir', 'description' => 'Souvenir', 'price' => 100, 'selling_unit' => 'piece', 'stock_quantity' => 1, 'status' => 'published']);

    $this->post(route('local-product-orders.store'), ['product_id' => $product->id, 'quantity' => 2, 'customer_name' => 'Tourist Guest', 'customer_email' => 'tourist@example.com', 'customer_contact' => '09123456789', 'fulfillment_method' => 'pickup', 'payment_method' => 'cash_on_pickup'])->assertSessionHasErrors('quantity');
    expect(LocalProductOrder::query()->count())->toBe(0)->and($product->refresh()->stock_quantity)->toBe(1);
});

test('checkout rejects seller-disabled fulfillment and payment methods', function (array $settings, array $override, string $errorField) {
    [, $enterprise, $category] = localProductContext();
    EnterpriseOrderSetting::create(['enterprise_id' => $enterprise->id, ...$settings]);
    $product = LocalProduct::create(['enterprise_id' => $enterprise->id, 'product_category_id' => $category->id, 'name' => 'Seller Policy Product', 'slug' => fake()->unique()->slug(), 'description' => 'Policy test', 'price' => 100, 'selling_unit' => 'piece', 'stock_quantity' => 5, 'status' => 'published']);
    $payload = ['product_id' => $product->id, 'quantity' => 1, 'customer_name' => 'Tourist Guest', 'customer_email' => 'tourist@example.com', 'customer_contact' => '09123456789', 'fulfillment_method' => 'pickup', 'payment_method' => 'cash_on_pickup', ...$override];

    $this->post(route('local-product-orders.store'), $payload)->assertSessionHasErrors($errorField);

    expect(LocalProductOrder::query()->count())->toBe(0)->and($product->refresh()->stock_quantity)->toBe(5);
})->with([
    'pickup disabled' => [['accepts_pickup' => false, 'accepts_delivery' => true, 'accepts_cash_on_pickup' => true], [], 'fulfillment_method'],
    'cash on pickup disabled' => [['accepts_pickup' => true, 'accepts_cash_on_pickup' => false, 'accepts_gcash' => true], [], 'payment_method'],
]);

test('checkout enforces minimum amount, stock availability, and preparation time', function () {
    [, $enterprise, $category] = localProductContext();
    Notification::fake();
    EnterpriseOrderSetting::create(['enterprise_id' => $enterprise->id, 'minimum_order_amount' => 200, 'estimated_preparation_days' => 3]);
    $product = LocalProduct::create(['enterprise_id' => $enterprise->id, 'product_category_id' => $category->id, 'name' => 'Prepared Product', 'slug' => 'prepared-product', 'description' => 'Prepared product', 'price' => 100, 'selling_unit' => 'piece', 'stock_quantity' => 2, 'preparation_days' => 5, 'status' => 'published']);
    $payload = ['product_id' => $product->id, 'quantity' => 1, 'customer_name' => 'Tourist Guest', 'customer_email' => 'tourist@example.com', 'customer_contact' => '09123456789', 'fulfillment_method' => 'pickup', 'payment_method' => 'cash_on_pickup'];

    $this->post(route('local-product-orders.store'), $payload)->assertSessionHasErrors('quantity');
    $this->post(route('local-product-orders.store'), [...$payload, 'quantity' => 2])->assertSessionHasNoErrors();

    $order = LocalProductOrder::firstOrFail();
    expect($order->estimated_ready_at->isSameDay(now()->addDays(5)))->toBeTrue()
        ->and($product->refresh()->stock_quantity)->toBe(0);

    $this->post(route('local-product-orders.store'), $payload)->assertSessionHasErrors('quantity');
});

test('seller cancellation and refund policies are enforced', function () {
    [$owner, $enterprise] = localProductContext();
    $settings = EnterpriseOrderSetting::create(['enterprise_id' => $enterprise->id, 'allows_order_cancellation' => false, 'allows_refunds' => false]);
    $order = LocalProductOrder::create(['order_number' => 'HIN-PROD-POLICY', 'enterprise_id' => $enterprise->id, 'customer_name' => 'Tourist Guest', 'customer_email' => 'tourist@example.com', 'customer_contact' => '09123456789', 'fulfillment_method' => 'pickup', 'subtotal' => 100, 'delivery_fee' => 0, 'total_amount' => 100, 'payment_method' => 'cash_on_pickup', 'payment_status' => 'verified', 'status' => 'accepted']);

    $this->actingAs($owner)->patch(route('partner.product-orders.update', $order), ['status' => 'cancelled'])->assertSessionHasErrors('status');
    $this->actingAs($owner)->patch(route('partner.product-orders.update', $order), ['payment_status' => 'refunded'])->assertSessionHasErrors('payment_status');

    $settings->update(['allows_order_cancellation' => true, 'cancellation_window_hours' => 1, 'allows_refunds' => true, 'refund_window_days' => 1]);
    $order->update(['created_at' => now()->subDays(2), 'completed_at' => now()->subDays(2), 'status' => 'completed']);
    $this->actingAs($owner)->patch(route('partner.product-orders.update', $order), ['payment_status' => 'refunded'])->assertSessionHasErrors('payment_status');
});

test('commerce settings require a fulfillment and payment method', function () {
    [$owner, $enterprise] = localProductContext();

    $this->actingAs($owner)->post(route('partner.enterprises.commerce-settings', $enterprise), [
        'accepts_pickup' => false,
        'accepts_delivery' => false,
        'delivery_fee' => 0,
        'minimum_order_amount' => null,
        'accepts_cash_on_pickup' => false,
        'accepts_gcash' => false,
        'estimated_preparation_days' => null,
        'allows_order_cancellation' => true,
        'cancellation_window_hours' => 24,
        'allows_refunds' => false,
        'refund_window_days' => 7,
    ])->assertSessionHasErrors(['accepts_pickup', 'accepts_cash_on_pickup']);
});
