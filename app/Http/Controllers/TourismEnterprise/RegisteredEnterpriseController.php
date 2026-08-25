<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\RegisterEnterpriseRequest;
use App\Models\Barangay;
use App\Models\Enterprise;
use App\Models\EnterpriseType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RegisteredEnterpriseController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('tourism-enterprise/register', [
            'enterpriseTypes' => EnterpriseType::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'barangays' => Barangay::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(RegisterEnterpriseRequest $request): RedirectResponse
    {
        $storedPaths = [];

        try {
            $logo = $request->file('logo')?->store('enterprises/logos', 'public');
            $coverImage = $request->file('cover_image')?->store('enterprises/covers', 'public');
            $storedPaths = array_values(array_filter([$logo, $coverImage]));

            $user = DB::transaction(function () use ($request, $logo, $coverImage, &$storedPaths): User {
                $role = Role::query()->firstOrCreate(['name' => 'Tourism Enterprise'], [
                    'description' => 'Owner or authorized representative of a registered tourism enterprise.',
                ]);
                $user = User::create([
                    'name' => $request->validated('name'),
                    'email' => $request->validated('account_email'),
                    'phone' => $request->validated('account_phone'),
                    'role_id' => $role->id,
                    'password' => Hash::make($request->validated('password')),
                ]);
                $enterprise = Enterprise::create([
                    'user_id' => $user->id,
                    'enterprise_type_id' => $request->validated('enterprise_type_id'),
                    'barangay_id' => $request->validated('barangay_id'),
                    'business_name' => $request->validated('business_name'),
                    'slug' => $this->uniqueSlug($request->validated('business_name')),
                    'contact_person' => $request->validated('contact_person'),
                    'email' => $request->validated('business_email'),
                    'phone' => $request->validated('business_phone'),
                    'description' => $request->validated('description'),
                    'address' => $request->validated('address'),
                    'latitude' => $request->validated('latitude'),
                    'longitude' => $request->validated('longitude'),
                    'website' => $request->validated('website'),
                    'license_number' => $request->validated('license_number'),
                    'logo' => $logo,
                    'cover_image' => $coverImage,
                    'application_status' => 'pending',
                ]);

                foreach ($request->validated('documents') as $index => $document) {
                    $path = $request->file("documents.{$index}.file")->store('enterprise-documents', 'public');
                    $storedPaths[] = $path;
                    $enterprise->documents()->create([
                        'document_type' => $document['document_type'],
                        'document_number' => $document['document_number'] ?? null,
                        'expiration_date' => $document['expiration_date'] ?? null,
                        'file_path' => $path,
                    ]);
                }

                return $user;
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedPaths);
            throw $exception;
        }

        event(new Registered($user));
        Auth::login($user);

        return to_route('partner.dashboard')->with('success', 'Your tourism enterprise application was submitted for review.');
    }

    private function uniqueSlug(string $businessName): string
    {
        $base = Str::slug($businessName) ?: 'tourism-enterprise';
        $slug = $base;
        $suffix = 2;

        while (Enterprise::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
