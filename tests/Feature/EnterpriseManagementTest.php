<?php

use App\Models\Enterprise;
use App\Models\EnterpriseDocument;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot access enterprise management', function () {
    $this->get('/admin/enterprises')->assertRedirect('/login');
});

test('authenticated users can list search and filter enterprise applications', function () {
    $user = User::factory()->create();
    $approved = Enterprise::factory()->create(['business_name' => 'Hinoba-an Beach Resort', 'application_status' => 'approved']);
    Enterprise::factory()->create(['business_name' => 'Unrelated Store', 'application_status' => 'pending']);

    $this->actingAs($user)->get('/admin/enterprises?status=approved&search=Beach')
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/enterprises/index')
            ->has('enterprises.data', 1)
            ->where('enterprises.data.0.id', $approved->id)
            ->where('filters.status', 'approved')
            ->where('counts.all', 2));
});

test('authenticated users can view an enterprise with documents and map coordinates', function () {
    $user = User::factory()->create();
    $enterprise = Enterprise::factory()->create(['latitude' => '9.6000000', 'longitude' => '122.4666667']);
    $document = EnterpriseDocument::factory()->for($enterprise)->create();

    $this->actingAs($user)->get(route('admin.enterprises.show', $enterprise))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/enterprises/show')
            ->where('enterprise.id', $enterprise->id)
            ->where('enterprise.documents.0.id', $document->id)
            ->where('enterprise.latitude', '9.6000000'));
});

test('approval records the approving administrator and timestamp', function () {
    $administrator = User::factory()->create();
    $enterprise = Enterprise::factory()->create(['application_status' => 'pending']);

    $this->actingAs($administrator)->patch(route('admin.enterprises.approve', $enterprise))->assertRedirect();

    expect($enterprise->refresh()->application_status)->toBe('approved')
        ->and($enterprise->approved_by)->toBe($administrator->id)
        ->and($enterprise->approved_at)->not->toBeNull()
        ->and($enterprise->rejection_reason)->toBeNull();
});

test('rejection requires and records a reason', function () {
    $administrator = User::factory()->create();
    $enterprise = Enterprise::factory()->create(['application_status' => 'pending']);

    $this->actingAs($administrator)->patch(route('admin.enterprises.reject', $enterprise), [])
        ->assertSessionHasErrors('rejection_reason');

    $this->patch(route('admin.enterprises.reject', $enterprise), ['rejection_reason' => 'The submitted permit is no longer valid.'])
        ->assertRedirect();

    expect($enterprise->refresh()->application_status)->toBe('rejected')
        ->and($enterprise->rejection_reason)->toBe('The submitted permit is no longer valid.')
        ->and($enterprise->approved_at)->toBeNull()
        ->and($enterprise->approved_by)->toBeNull();
});

test('approved enterprises can be suspended and reactivated', function () {
    $administrator = User::factory()->create();
    $enterprise = Enterprise::factory()->create([
        'application_status' => 'approved',
        'approved_at' => now()->subDay(),
        'approved_by' => $administrator->id,
    ]);

    $this->actingAs($administrator)->patch(route('admin.enterprises.suspend', $enterprise))->assertRedirect();
    expect($enterprise->refresh()->application_status)->toBe('suspended');

    $this->patch(route('admin.enterprises.reactivate', $enterprise))->assertRedirect();
    expect($enterprise->refresh()->application_status)->toBe('approved')
        ->and($enterprise->approved_by)->toBe($administrator->id);
});

test('documents can be verified or rejected with required remarks', function () {
    $administrator = User::factory()->create();
    $enterprise = Enterprise::factory()->create();
    $document = EnterpriseDocument::factory()->for($enterprise)->create();

    $this->actingAs($administrator)->patch(route('admin.enterprises.documents.verify', [$enterprise, $document]), [
        'verification_status' => 'verified',
        'remarks' => '',
    ])->assertRedirect();
    expect($document->refresh()->verification_status)->toBe('verified');

    $this->patch(route('admin.enterprises.documents.verify', [$enterprise, $document]), [
        'verification_status' => 'rejected',
        'remarks' => '',
    ])->assertSessionHasErrors('remarks');

    $this->patch(route('admin.enterprises.documents.verify', [$enterprise, $document]), [
        'verification_status' => 'rejected',
        'remarks' => 'The document is unreadable.',
    ])->assertRedirect();
    expect($document->refresh()->verification_status)->toBe('rejected')
        ->and($document->remarks)->toBe('The document is unreadable.');
});

test('a document cannot be reviewed through a different enterprise', function () {
    $administrator = User::factory()->create();
    $enterprise = Enterprise::factory()->create();
    $otherEnterprise = Enterprise::factory()->create();
    $document = EnterpriseDocument::factory()->for($otherEnterprise)->create();

    $this->actingAs($administrator)->patch(route('admin.enterprises.documents.verify', [$enterprise, $document]), [
        'verification_status' => 'verified',
        'remarks' => '',
    ])->assertNotFound();
});
