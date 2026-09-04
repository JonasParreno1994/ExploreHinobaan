<?php

use App\Models\Enterprise;
use App\Models\EnterpriseService;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\TouristVerification;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('a visitor registers through the shared user authentication system as a tourist', function () {
    Notification::fake();
    $this->post(route('tourist.register.store'), ['name' => 'Maria Tourist', 'email' => 'maria@example.com', 'phone' => '09123456789', 'country' => 'Philippines', 'province' => 'Negros Occidental', 'city_municipality' => 'Bacolod City', 'password' => 'password', 'password_confirmation' => 'password'])->assertRedirect(route('verification.notice'));
    $tourist = User::query()->where('email', 'maria@example.com')->firstOrFail();
    expect($tourist->role->name)->toBe('Tourist')->and($tourist->email_verified_at)->toBeNull();
    $this->assertAuthenticatedAs($tourist);
    Notification::assertSentTo($tourist, VerifyEmail::class);
});

test('tourist identity documents are stored privately and cannot be accessed by an enterprise', function () {
    Storage::fake('local');
    $tourist = User::factory()->for(Role::query()->firstOrCreate(['name' => 'Tourist']))->create();
    $image = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
    $this->actingAs($tourist)->post(route('tourist.verification.store'), ['id_type' => 'National ID', 'id_front' => UploadedFile::fake()->createWithContent('front.png', $image), 'selfie_with_id' => UploadedFile::fake()->createWithContent('selfie.png', $image), 'privacy_consent' => '1'])->assertSessionHasNoErrors();
    $verification = TouristVerification::query()->firstOrFail();
    Storage::disk('local')->assertExists([$verification->id_front_path, $verification->selfie_with_id_path]);
    $enterpriseUser = User::factory()->for(Role::query()->firstOrCreate(['name' => 'Tourism Enterprise']))->create();
    $this->actingAs($enterpriseUser)->get(route('admin.tourist-verifications.document', [$verification, 'front']))->assertForbidden();
});

test('administrator can review private documents and approve a tourist', function () {
    Notification::fake();
    Storage::fake('local');
    Storage::disk('local')->put('tourist-verifications/front.jpg', 'image');
    $tourist = User::factory()->for(Role::query()->firstOrCreate(['name' => 'Tourist']))->create();
    $verification = TouristVerification::factory()->for($tourist)->create();
    $administrator = User::factory()->for(Role::query()->firstOrCreate(['name' => 'Administrator']))->create();
    $this->actingAs($administrator)->get(route('admin.tourist-verifications.document', [$verification, 'front']))->assertSuccessful();
    $this->patch(route('admin.tourist-verifications.update', $verification), ['verification_status' => 'verified'])->assertRedirect();
    expect($verification->refresh()->verification_status)->toBe('verified')->and($verification->verified_by)->toBe($administrator->id)->and($verification->verified_at)->not->toBeNull();
});

test('registered reservations link to the tourist while guest reservations remain unlinked', function () {
    Notification::fake();
    $enterprise = Enterprise::factory()->create(['application_status' => 'approved']);
    $service = EnterpriseService::factory()->for($enterprise)->create(['reservation_mode' => 'day', 'quantity' => 2]);
    $payload = ['enterprise_service_id' => $service->id, 'customer_name' => 'Tourist', 'customer_email' => 'tourist@example.com', 'customer_contact' => '09123456789', 'quantity' => 1, 'number_of_guests' => 1, 'reservation_date' => now()->addDays(2)->toDateString()];
    $this->post(route('reservations.store'), $payload)->assertRedirect();
    expect(Reservation::query()->latest('id')->value('customer_id'))->toBeNull();
    $tourist = User::factory()->for(Role::query()->firstOrCreate(['name' => 'Tourist']))->create();
    $this->actingAs($tourist)->post(route('reservations.store'), [...$payload, 'customer_email' => $tourist->email])->assertRedirect();
    expect(Reservation::query()->latest('id')->value('customer_id'))->toBe($tourist->id);
});

test('a tourist can only view their own reservation', function () {
    $role = Role::query()->firstOrCreate(['name' => 'Tourist']);
    $owner = User::factory()->for($role)->create();
    $intruder = User::factory()->for($role)->create();
    $enterprise = Enterprise::factory()->create();
    $reservation = Reservation::query()->create(['reservation_number' => 'HIN-OWNER-001', 'enterprise_id' => $enterprise->id, 'customer_id' => $owner->id, 'customer_name' => $owner->name, 'customer_email' => $owner->email, 'customer_contact' => '09123456789', 'total_amount' => 500, 'status' => 'pending']);
    $this->actingAs($owner)->get(route('tourist.reservations.show', $reservation))->assertSuccessful();
    $this->actingAs($intruder)->get(route('tourist.reservations.show', $reservation))->assertForbidden();
});
