<?php

use App\Models\AuditLog;
use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\Role;
use App\Models\SecurityEvent;
use App\Models\SecurityIncident;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('only administrators can view security monitoring', function () {
    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    $staff = User::factory()->for(Role::factory()->create(['name' => 'Tourism Staff']))->create();

    $this->get(route('admin.security-monitoring.index'))->assertRedirect('/login');
    $this->actingAs($staff)->get(route('admin.security-monitoring.index'))->assertForbidden();
    $this->actingAs($administrator)->get(route('admin.security-monitoring.index'))->assertSuccessful();
});

test('security monitoring provides overview alerts decisions incidents and analytics', function () {
    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    SecurityEvent::factory()->create(['severity' => 'critical', 'risk_score' => 95, 'decision' => 'block']);
    SecurityEvent::factory()->create(['event_type' => 'login_success', 'attack_type' => null, 'severity' => 'informational', 'risk_score' => 5, 'decision' => 'allow', 'result' => 'allowed']);
    SecurityIncident::factory()->create();
    AuditLog::factory()->create();
    DB::table('sessions')->insert(['id' => 'active-security-session', 'user_id' => $administrator->id, 'ip_address' => '127.0.0.1', 'user_agent' => 'Pest', 'payload' => '', 'last_activity' => now()->timestamp]);

    $this->actingAs($administrator)->get(route('admin.security-monitoring.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/security-monitoring/index')
            ->where('statistics.total_events', 3)
            ->where('statistics.critical_alerts', 1)
            ->where('statistics.blocked_requests', 2)
            ->has('securityEvents', 3)
            ->has('idsAlerts', 2)
            ->has('incidents', 1)
            ->has('analytics.severity')
            ->has('zeroTrustDecisions')
            ->has('auditLogs', 1)
            ->has('activeSessions', 1));
});

test('failed and repeated login attempts create explainable security events', function () {
    User::factory()->create(['email' => 'admin@example.com']);

    foreach (range(1, 4) as $attempt) {
        $this->post('/login', ['email' => 'admin@example.com', 'password' => 'incorrect-password'])->assertSessionHasErrors('email');
    }

    $event = SecurityEvent::query()->latest('id')->firstOrFail();
    expect(AuditLog::query()->where('action', 'failed_login')->count())->toBe(4)
        ->and($event->event_type)->toBe('failed_login')
        ->and($event->risk_score)->toBeGreaterThanOrEqual(65)
        ->and($event->explanation)->toHaveCount(2)
        ->and(SecurityIncident::query()->count())->toBe(1);
});

test('cross enterprise access is blocked and recorded as an authorization violation', function () {
    $role = Role::factory()->create(['name' => 'Tourism Enterprise']);
    $owner = User::factory()->for($role)->create();
    $intruder = User::factory()->for($role)->create();
    $service = EnterpriseService::factory()->for(Enterprise::factory()->for($owner))->create();

    $this->actingAs($intruder)->get(route('partner.services.edit', $service))->assertForbidden();

    expect(SecurityEvent::query()->where('event_type', 'authorization_violation')->where('user_id', $intruder->id)->exists())->toBeTrue()
        ->and(SecurityIncident::query()->where('title', 'Authorization violation detected')->exists())->toBeTrue();
});

test('administrator can manage incident status', function () {
    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    $incident = SecurityIncident::factory()->create();

    $this->actingAs($administrator)->patch(route('admin.security-incidents.update', $incident), ['status' => 'investigating', 'notes' => 'Reviewing source IP.'])->assertRedirect();

    expect($incident->refresh()->status)->toBe('investigating')
        ->and($incident->assigned_to)->toBe($administrator->id)
        ->and($incident->notes)->toBe('Reviewing source IP.');
});
