<?php

use App\Models\Announcement;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot access announcement management', function () {
    $this->get('/admin/announcements')->assertRedirect('/login');
});

test('authenticated users can create an announcement with an automatic slug', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/admin/announcements', [
        'title' => 'Municipal Tourism Week',
        'content' => 'Join the municipality for tourism week activities.',
        'publish_date' => '2026-09-01',
        'expiration_date' => '2026-09-30',
        'status' => 'active',
    ])->assertRedirect(route('admin.announcements.index'));

    $announcement = Announcement::firstOrFail();
    expect($announcement->slug)->toBe('municipal-tourism-week');
    $this->assertModelExists($announcement);
});

test('announcement expiration cannot be before its publish date', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/admin/announcements', [
        'title' => 'Invalid Schedule',
        'content' => 'Schedule validation test.',
        'publish_date' => '2026-09-10',
        'expiration_date' => '2026-09-01',
        'status' => 'active',
    ])->assertSessionHasErrors('expiration_date');
});

test('authenticated users can view and update an announcement', function () {
    $user = User::factory()->create();
    $announcement = Announcement::factory()->create(['title' => 'Original Title', 'slug' => 'original-title']);

    $this->actingAs($user)->get(route('admin.announcements.show', $announcement))->assertInertia(
        fn (Assert $page) => $page->component('admin/announcements/show')->where('announcement.id', $announcement->id),
    );

    $this->put(route('admin.announcements.update', $announcement), [
        'title' => 'Updated Title',
        'content' => 'Updated announcement content.',
        'publish_date' => '2026-10-01',
        'expiration_date' => '',
        'status' => 'inactive',
    ])->assertRedirect(route('admin.announcements.index'));

    expect($announcement->refresh()->slug)->toBe('updated-title')->and($announcement->status)->toBe('inactive');
});

test('duplicate announcement titles receive unique slugs', function () {
    $user = User::factory()->create();
    Announcement::factory()->create(['slug' => 'tourism-advisory']);

    $this->actingAs($user)->post('/admin/announcements', [
        'title' => 'Tourism Advisory', 'content' => 'A new advisory.', 'publish_date' => '2026-09-01',
        'expiration_date' => '', 'status' => 'active',
    ])->assertRedirect(route('admin.announcements.index'));

    expect(Announcement::where('slug', 'tourism-advisory-2')->exists())->toBeTrue();
});

test('authenticated users can delete an announcement', function () {
    $user = User::factory()->create();
    $announcement = Announcement::factory()->create();

    $this->actingAs($user)->delete(route('admin.announcements.destroy', $announcement))->assertRedirect(route('admin.announcements.index'));

    $this->assertModelMissing($announcement);
});
