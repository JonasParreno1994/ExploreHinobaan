<?php

use App\Models\TourismCategory;
use App\Models\User;
use Database\Seeders\TourismCategorySeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot access tourism category management', function () {
    $this->get('/admin/categories')->assertRedirect('/login');
});

test('the tourism category seeder creates the required active categories', function () {
    $this->seed(TourismCategorySeeder::class);

    expect(TourismCategory::count())->toBe(11)
        ->and(TourismCategory::where('status', 'active')->count())->toBe(11)
        ->and(TourismCategory::where('name', 'Beaches')->value('icon'))->toBe('Waves');
});

test('authenticated users can search paginated tourism categories', function () {
    $user = User::factory()->create();
    TourismCategory::factory()->create(['name' => 'Hidden Caves']);
    TourismCategory::factory()->create(['name' => 'Sunny Beaches']);

    $this->actingAs($user)->get('/admin/categories?search=caves')->assertInertia(
        fn (Assert $page) => $page->component('admin/categories/index')
            ->where('filters.search', 'caves')
            ->has('categories.data', 1)
            ->where('categories.data.0.name', 'Hidden Caves'),
    );
});

test('authenticated users can create a tourism category with an automatic slug', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/admin/categories', [
        'name' => 'Marine Sanctuaries',
        'description' => 'Protected coastal attractions.',
        'icon' => 'Waves',
        'status' => 'active',
    ])->assertRedirect(route('admin.categories.index'));

    $category = TourismCategory::firstOrFail();
    expect($category->slug)->toBe('marine-sanctuaries');
    $this->assertModelExists($category);
});

test('authenticated users can update and deactivate a tourism category', function () {
    $user = User::factory()->create();
    $category = TourismCategory::factory()->create(['name' => 'Old Category']);

    $this->actingAs($user)->put(route('admin.categories.update', $category), [
        'name' => 'Updated Category', 'description' => '', 'icon' => 'Trees', 'status' => 'active',
    ])->assertRedirect(route('admin.categories.index'));

    $this->patch(route('admin.categories.deactivate', $category))->assertRedirect();

    expect($category->refresh()->name)->toBe('Updated Category')
        ->and($category->slug)->toBe('updated-category')
        ->and($category->status)->toBe('inactive');
});

test('tourism categories can be activated but not permanently deleted', function () {
    $user = User::factory()->create();
    $category = TourismCategory::factory()->create(['status' => 'inactive']);

    $this->actingAs($user)->patch(route('admin.categories.activate', $category))->assertRedirect();
    expect($category->refresh()->status)->toBe('active');

    $this->delete("/admin/categories/{$category->id}")->assertMethodNotAllowed();
    $this->assertModelExists($category);
});
