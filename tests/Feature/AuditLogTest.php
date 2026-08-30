<?php

use App\Models\AuditLog;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot view audit logs', function () {
    $this->get('/admin/audit-logs')->assertRedirect('/login');
});

test('authenticated changes are recorded without sensitive values', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();

    $this->actingAs($user)->post('/admin/roles', [
        'name' => 'Audited Role',
        'description' => 'Created during an audit test.',
        'password' => 'must-not-be-recorded',
    ])->assertRedirect(route('admin.roles.index'));

    $log = AuditLog::latest('id')->firstOrFail();

    expect($log->user_id)->toBe($user->id)
        ->and($log->actor_email)->toBe($user->email)
        ->and($log->action)->toBe('created')
        ->and($log->route_name)->toBe('admin.roles.store')
        ->and($log->metadata['changed_fields'])->toContain('name', 'description')
        ->not->toContain('password');
});

test('successful login and logout are recorded', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();

    $this->post('/login', ['email' => $user->email, 'password' => 'password']);
    $this->post('/logout');

    expect(AuditLog::where('user_id', $user->id)->pluck('action')->all())
        ->toContain('logged_in', 'logged_out');
});

test('authenticated users can view and search audit logs', function () {
    $user = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    AuditLog::factory()->create(['actor_name' => 'Maria Auditor', 'actor_email' => 'maria@example.com']);

    $this->actingAs($user)
        ->get('/admin/audit-logs?search=Maria')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/audit-logs/index')
            ->has('logs.data', 1)
            ->where('logs.data.0.actor_name', 'Maria Auditor'));
});
