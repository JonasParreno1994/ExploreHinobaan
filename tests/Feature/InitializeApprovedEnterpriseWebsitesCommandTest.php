<?php

use App\Models\Enterprise;
use App\Models\EnterpriseSection;
use App\Models\EnterpriseWebsite;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it initializes approved enterprise websites without overwriting existing content', function () {
    $legacyEnterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $existingEnterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $pendingEnterprise = Enterprise::factory()->create(['application_status' => 'pending']);
    $existingWebsite = EnterpriseWebsite::factory()->for($existingEnterprise)->create([
        'template' => 'elegant',
        'tagline' => 'Keep this customized tagline',
        'is_published' => true,
    ]);
    $existingAbout = EnterpriseSection::factory()->for($existingEnterprise)->create([
        'section_type' => 'about',
        'title' => 'Our existing story',
        'content' => 'This content must not be replaced.',
    ]);

    $this->artisan('enterprise-websites:initialize')
        ->expectsOutput('Initialized 1 website(s); 1 existing website(s) preserved.')
        ->assertSuccessful();

    expect($legacyEnterprise->microsite()->exists())->toBeTrue()
        ->and($legacyEnterprise->sections()->where('section_type', 'builder_hero')->exists())->toBeTrue()
        ->and($pendingEnterprise->microsite()->exists())->toBeFalse()
        ->and($existingWebsite->refresh()->template->value)->toBe('elegant')
        ->and($existingWebsite->tagline)->toBe('Keep this customized tagline')
        ->and($existingWebsite->is_published)->toBeTrue()
        ->and($existingAbout->refresh()->title)->toBe('Our existing story')
        ->and($existingAbout->content)->toBe('This content must not be replaced.')
        ->and($existingEnterprise->sections()->where('section_type', 'builder_hero')->exists())->toBeTrue();
});

test('it is idempotent when run repeatedly', function () {
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);

    $this->artisan('enterprise-websites:initialize')->assertSuccessful();
    $websiteId = $enterprise->microsite()->sole()->id;
    $sectionCount = $enterprise->sections()->count();

    $this->artisan('enterprise-websites:initialize')
        ->expectsOutput('Initialized 0 website(s); 1 existing website(s) preserved.')
        ->assertSuccessful();

    expect($enterprise->microsite()->sole()->id)->toBe($websiteId)
        ->and($enterprise->sections()->count())->toBe($sectionCount);
});
