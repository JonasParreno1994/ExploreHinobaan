<?php

use App\Models\Barangay;
use App\Models\Event;
use App\Models\User;
use Database\Seeders\EventSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function eventImage(string $name = 'event.png'): UploadedFile
{
    return UploadedFile::fake()->createWithContent($name, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', true));
}

test('guests cannot access event management', function () {
    $this->get('/admin/events')->assertRedirect('/login');
});

test('authenticated users can create an event with an optional schedule and image', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $barangay = Barangay::factory()->create();

    $this->actingAs($user)->post('/admin/events', [
        'barangay_id' => $barangay->id,
        'title' => 'Hinoba-an Tourism Day',
        'event_type' => 'Tourism Event',
        'short_description' => 'A municipal tourism celebration.',
        'description' => 'Tourism activities for residents and visitors.',
        'venue' => 'Municipality of Hinoba-an',
        'start_date' => '',
        'end_date' => '',
        'start_time' => '',
        'end_time' => '',
        'featured_image' => eventImage(),
        'registration_link' => 'https://example.com/register',
        'organizer' => 'Municipal Tourism Office',
        'contact_number' => '09123456789',
        'status' => 'draft',
        'is_featured' => true,
    ])->assertRedirect(route('admin.events.index'));

    $event = Event::firstOrFail();
    expect($event->slug)->toBe('hinoba-an-tourism-day')
        ->and($event->start_date)->toBeNull()
        ->and($event->created_by)->toBe($user->id)
        ->and($event->schedule_status)->toBe('schedule_pending');
    Storage::disk('public')->assertExists($event->featured_image);
});

test('event validation rejects invalid types and schedule ranges', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/admin/events', [
        'title' => 'Invalid Event',
        'event_type' => 'Unknown',
        'venue' => 'Test Venue',
        'start_date' => '2026-09-10',
        'end_date' => '2026-09-01',
        'start_time' => '17:00',
        'end_time' => '08:00',
        'status' => 'draft',
        'is_featured' => false,
    ])->assertSessionHasErrors(['event_type', 'end_date', 'end_time']);
});

test('authenticated users can list filter view and update events', function () {
    $user = User::factory()->create();
    $barangay = Barangay::factory()->create();
    $event = Event::factory()->create([
        'barangay_id' => $barangay->id,
        'title' => 'Community Sports Day',
        'event_type' => 'Sports Event',
        'start_date' => today()->addWeek()->toDateString(),
    ]);

    $this->actingAs($user)->get('/admin/events?search=Sports&event_type=Sports%20Event&barangay='.$barangay->id.'&date=upcoming')
        ->assertInertia(fn (Assert $page) => $page->component('admin/events/index')->has('events.data', 1)->where('events.data.0.id', $event->id));

    $this->get(route('admin.events.show', $event))->assertInertia(
        fn (Assert $page) => $page->component('admin/events/show')->where('event.id', $event->id),
    );

    $this->put(route('admin.events.update', $event), [
        'barangay_id' => '',
        'title' => 'Updated Community Day',
        'event_type' => 'Community Event',
        'venue' => 'Municipal Grounds',
        'start_date' => '2026-10-01',
        'end_date' => '2026-10-02',
        'start_time' => '08:00',
        'end_time' => '17:00',
        'status' => 'published',
        'is_featured' => false,
    ])->assertRedirect(route('admin.events.show', $event));

    expect($event->refresh()->slug)->toBe('updated-community-day')
        ->and($event->event_type)->toBe('Community Event')
        ->and($event->barangay_id)->toBeNull();
});

test('events can be published archived and featured', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create(['status' => 'draft', 'is_featured' => false]);

    $this->actingAs($user)->patch(route('admin.events.publish', $event))->assertRedirect();
    expect($event->refresh()->status)->toBe('published');

    $this->patch(route('admin.events.toggle-featured', $event))->assertRedirect();
    expect($event->refresh()->is_featured)->toBeTrue();

    $this->patch(route('admin.events.archive', $event))->assertRedirect();
    expect($event->refresh()->status)->toBe('archived')->and($event->is_featured)->toBeFalse();
});

test('deleting an event removes its featured image', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $path = eventImage('festival.png')->store('events/featured', 'public');
    $event = Event::factory()->create(['featured_image' => $path]);

    $this->actingAs($user)->delete(route('admin.events.destroy', $event))->assertRedirect(route('admin.events.index'));

    $this->assertModelMissing($event);
    Storage::disk('public')->assertMissing($path);
});

test('the supplied festival seeder keeps unverified dates null', function () {
    $this->seed(EventSeeder::class);

    expect(Event::query()->count())->toBe(2);
    Event::query()->each(function (Event $event): void {
        expect($event->event_type)->toBe('Festival')
            ->and($event->venue)->toBe('Municipality of Hinoba-an')
            ->and($event->status)->toBe('published')
            ->and($event->is_featured)->toBeTrue()
            ->and($event->start_date)->toBeNull();
    });
});
