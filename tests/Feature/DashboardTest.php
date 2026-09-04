<?php

use App\Models\DailyTouristReport;
use App\Models\Destination;
use App\Models\Enterprise;
use App\Models\EnterpriseDocument;
use App\Models\Event;
use App\Models\Review;
use App\Models\Role;
use App\Models\SecurityIncident;
use App\Models\TouristArrival;
use App\Models\TouristVerification;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $role = Role::factory()->create(['name' => 'Administrator']);
    $this->actingAs($user = User::factory()->for($role)->create());

    $this->get('/dashboard')->assertOk();
});

test('dashboard presents tourism operations and attention data', function () {
    $administratorRole = Role::factory()->create(['name' => 'Administrator']);
    $administrator = User::factory()->for($administratorRole)->create();
    $approvedEnterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    Enterprise::factory()->create(['application_status' => 'pending']);
    EnterpriseDocument::factory()->for($approvedEnterprise)->create(['verification_status' => 'pending']);
    TouristVerification::factory()->create(['verification_status' => 'pending']);
    DailyTouristReport::factory()->for($approvedEnterprise)->create([
        'status' => 'submitted',
        'submitted_by' => $administrator->id,
        'submitted_at' => now(),
        'report_date' => today(),
    ]);
    Review::factory()->create(['status' => 'pending']);
    SecurityIncident::factory()->create(['status' => 'new']);
    Destination::factory()->create(['name' => 'Popular Beach', 'status' => 'published', 'views' => 250]);
    Event::factory()->create(['title' => 'Tourism Festival', 'status' => 'published', 'start_date' => today()->addWeek()]);

    TouristArrival::factory()->for($approvedEnterprise)->create([
        'created_by' => $administrator->id,
        'arrival_date' => today(),
        'booking_source' => 'walk_in',
        'visitor_type' => 'domestic',
        'country' => 'Philippines',
        'adults' => 2,
        'children' => 1,
        'total_guests' => 3,
        'visit_type' => 'day_visit',
        'arrival_type' => 'individual',
    ]);
    TouristArrival::factory()->for($approvedEnterprise)->create([
        'created_by' => $administrator->id,
        'arrival_date' => today(),
        'booking_source' => 'website',
        'visitor_type' => 'foreign',
        'country' => 'Japan',
        'adults' => 2,
        'children' => 0,
        'total_guests' => 2,
        'visit_type' => 'overnight',
        'arrival_type' => 'individual',
    ]);

    $this->actingAs($administrator)->get(route('dashboard'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->where('period', 'month')
        ->where('statistics.total_visitors', 5)
        ->where('statistics.domestic', 3)
        ->where('statistics.foreign', 2)
        ->where('statistics.day_visitors', 3)
        ->where('statistics.overnight', 2)
        ->where('statistics.active_enterprises', 1)
        ->where('attention.enterprise_applications.count', 1)
        ->where('attention.enterprise_documents.count', 1)
        ->where('attention.tourist_verifications.count', 1)
        ->where('attention.daily_reports.count', 1)
        ->where('attention.reviews.count', 1)
        ->where('attention.security_incidents.count', 1)
        ->where('topEnterprises.0.business_name', $approvedEnterprise->business_name)
        ->where('topEnterprises.0.visitor_count', 5)
        ->where('topDestinations.0.name', 'Popular Beach')
        ->where('upcomingEvents.0.title', 'Tourism Festival')
        ->where('isAdministrator', true));
});

test('tourism staff dashboard excludes administrator security information and accepts period filters', function () {
    $staffRole = Role::factory()->create(['name' => 'Tourism Staff']);
    $staff = User::factory()->for($staffRole)->create();
    SecurityIncident::factory()->create(['status' => 'new']);

    $this->actingAs($staff)->get(route('dashboard', ['period' => 'today']))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->where('period', 'today')
        ->missing('attention.security_incidents')
        ->where('isAdministrator', false));
});
