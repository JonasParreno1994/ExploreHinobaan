<?php

use App\Models\Barangay;
use App\Models\User;
use Database\Seeders\BarangaySeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot access barangay management', function () {
    $this->get('/admin/barangays')->assertRedirect('/login');
});

test('authenticated users can list and search barangays', function () {
    $user = User::factory()->create();
    Barangay::factory()->create(['name' => 'Searchable Village', 'psgc_code' => '1804512999']);
    Barangay::factory()->create(['name' => 'Different Place', 'psgc_code' => '1804512998']);

    $this->actingAs($user)->get('/admin/barangays?search=Searchable')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('admin/barangays/index')->has('barangays.data', 1)->where('barangays.data.0.name', 'Searchable Village'));
});

test('authenticated users can add and view a barangay with an automatic slug', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/admin/barangays', [
        'psgc_code' => '1804512997', 'name' => 'New Barangay', 'classification' => 'rural', 'population' => 4321, 'status' => 'active',
    ])->assertRedirect(route('admin.barangays.index'));

    $barangay = Barangay::where('psgc_code', '1804512997')->firstOrFail();
    expect($barangay->slug)->toBe('new-barangay');

    $this->get(route('admin.barangays.show', $barangay))->assertInertia(fn (Assert $page) => $page->component('admin/barangays/show')->where('barangay.id', $barangay->id));
});

test('authenticated users can edit and automatically regenerate a slug', function () {
    $user = User::factory()->create();
    $barangay = Barangay::factory()->create();

    $this->actingAs($user)->put(route('admin.barangays.update', $barangay), [
        'psgc_code' => $barangay->psgc_code, 'name' => 'Renamed Barangay', 'classification' => 'urban', 'population' => 5000, 'status' => 'active',
    ])->assertRedirect(route('admin.barangays.index'));

    expect($barangay->refresh()->slug)->toBe('renamed-barangay')->and($barangay->classification)->toBe('urban');
});

test('barangays can be deactivated and activated without deletion', function () {
    $user = User::factory()->create();
    $barangay = Barangay::factory()->create(['status' => 'active']);

    $this->actingAs($user)->patch(route('admin.barangays.deactivate', $barangay))->assertRedirect();
    expect($barangay->refresh()->status)->toBe('inactive');

    $this->patch(route('admin.barangays.activate', $barangay))->assertRedirect();
    expect($barangay->refresh()->status)->toBe('active');
    $this->assertModelExists($barangay);
});

test('barangay validation enforces required choices and uniqueness', function () {
    $user = User::factory()->create();
    $barangay = Barangay::factory()->create();

    $this->actingAs($user)->post('/admin/barangays', [
        'psgc_code' => $barangay->psgc_code, 'name' => $barangay->name, 'classification' => 'suburban', 'population' => -1, 'status' => 'deleted',
    ])->assertSessionHasErrors(['psgc_code', 'name', 'classification', 'population', 'status']);
});

test('the barangay seeder creates the supplied active dataset', function () {
    $this->seed(BarangaySeeder::class);

    expect(Barangay::count())->toBe(13)
        ->and(Barangay::where('status', 'active')->count())->toBe(13)
        ->and(Barangay::where('name', 'Asia')->value('population'))->toBe(9407)
        ->and(Barangay::where('name', 'Po-ok')->value('psgc_code'))->toBe('1804512010');
});
