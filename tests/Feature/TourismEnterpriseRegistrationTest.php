<?php

use App\Models\Barangay;
use App\Models\Enterprise;
use App\Models\EnterpriseType;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function validPartnerRegistration(array $overrides = []): array
{
    return [
        'name' => 'Maria Partner',
        'account_email' => 'partner@example.com',
        'account_phone' => '09123456789',
        'password' => 'password',
        'password_confirmation' => 'password',
        'enterprise_type_id' => EnterpriseType::factory()->create(['status' => 'active'])->id,
        'barangay_id' => Barangay::factory()->create(['status' => 'active'])->id,
        'business_name' => 'Hinoba-an Adventure Resort',
        'contact_person' => 'Maria Partner',
        'business_email' => 'business@example.com',
        'business_phone' => '09987654321',
        'description' => 'A locally operated tourism enterprise.',
        'address' => 'Barangay Bacuyangan, Hinoba-an',
        'latitude' => '9.5000000',
        'longitude' => '122.6000000',
        'website' => 'https://example.com',
        'license_number' => 'BP-2026-001',
        'documents' => [[
            'document_type' => 'Business Permit',
            'document_number' => 'BP-2026-001',
            'expiration_date' => '2027-12-31',
            'file' => UploadedFile::fake()->create('permit.pdf', 100, 'application/pdf'),
        ]],
        'terms' => true,
        ...$overrides,
    ];
}

test('tourism enterprise registration page provides active form options', function () {
    EnterpriseType::factory()->create(['status' => 'active']);
    Barangay::factory()->create(['status' => 'active']);

    $this->get(route('partner.register'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('tourism-enterprise/register')
        ->has('enterpriseTypes', 1)
        ->has('barangays', 1));
});

test('a partner can submit an enterprise registration using the existing enterprise tables', function () {
    Storage::fake('public');

    $this->post(route('partner.register.store'), validPartnerRegistration())
        ->assertRedirect(route('partner.dashboard'));

    $enterprise = Enterprise::query()->with(['user.role', 'documents'])->firstOrFail();
    expect($enterprise->business_name)->toBe('Hinoba-an Adventure Resort')
        ->and($enterprise->application_status)->toBe('pending')
        ->and($enterprise->user->role->name)->toBe('Tourism Enterprise')
        ->and($enterprise->documents)->toHaveCount(1)
        ->and($enterprise->documents->first()->verification_status)->toBe('pending');
    Storage::disk('public')->assertExists($enterprise->documents->first()->file_path);
    $this->assertAuthenticatedAs($enterprise->user);
});

test('enterprise registration requires a legal document and accepted declaration', function () {
    $this->post(route('partner.register.store'), validPartnerRegistration(['documents' => [], 'terms' => false]))
        ->assertInvalid(['documents', 'terms']);
});
