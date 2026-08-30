<?php

use App\Models\DailyTouristReport;
use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\Role;
use App\Models\TouristArrival;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('administrator sees consolidated tourist arrivals and daily reports', function () {
    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    $owner = User::factory()->for(Role::factory()->create(['name' => 'Tourism Enterprise']))->create();
    $resortType = EnterpriseType::factory()->create(['name' => 'Resort']);
    $enterprise = Enterprise::factory()->for($owner)->for($resortType)->create(['application_status' => 'approved']);
    TouristArrival::query()->create(['enterprise_id' => $enterprise->id, 'created_by' => $owner->id, 'arrival_date' => today(), 'booking_source' => 'walk_in', 'visitor_type' => 'domestic', 'country' => 'Philippines', 'province' => 'Negros Occidental', 'city_municipality' => 'Bacolod City', 'adults' => 4, 'children' => 2, 'total_guests' => 6, 'visit_type' => 'overnight', 'arrival_type' => 'accommodation_checkin']);
    DailyTouristReport::query()->create(['enterprise_id' => $enterprise->id, 'report_date' => today(), 'status' => 'submitted', 'submitted_by' => $owner->id, 'submitted_at' => now()]);

    $this->actingAs($administrator)->get(route('admin.tourist-arrivals.index'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('admin/tourist-arrivals/index')->where('summary.total', 6)->where('summary.domestic', 6)->has('arrivals.data', 1)->has('reports.data', 1));
});

test('administrator can verify a submitted daily tourist report', function () {
    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    $owner = User::factory()->create();
    $enterprise = Enterprise::factory()->for($owner)->create();
    $report = DailyTouristReport::query()->create(['enterprise_id' => $enterprise->id, 'report_date' => today(), 'status' => 'submitted', 'submitted_by' => $owner->id, 'submitted_at' => now()]);

    $this->actingAs($administrator)->patch(route('admin.daily-tourist-reports.update', $report), ['status' => 'verified'])->assertRedirect();
    expect($report->refresh()->status)->toBe('verified')->and($report->verified_by)->toBe($administrator->id);
});
