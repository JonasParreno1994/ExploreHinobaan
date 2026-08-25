<?php

namespace App\Http\Requests\TourismEnterprise;

use App\Models\Barangay;
use App\Models\EnterpriseType;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterEnterpriseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<mixed>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'account_email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class, 'email')],
            'account_phone' => ['required', 'string', 'max:50'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'enterprise_type_id' => ['required', 'integer', Rule::exists(EnterpriseType::class, 'id')->where('status', 'active')],
            'barangay_id' => ['required', 'integer', Rule::exists(Barangay::class, 'id')->where('status', 'active')],
            'business_name' => ['required', 'string', 'max:255'],
            'contact_person' => ['required', 'string', 'max:255'],
            'business_email' => ['required', 'email', 'max:255'],
            'business_phone' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:5000'],
            'address' => ['required', 'string', 'max:2000'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'website' => ['nullable', 'url', 'max:2048'],
            'license_number' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'documents' => ['required', 'array', 'min:1', 'max:10'],
            'documents.*.document_type' => ['required', 'string', 'max:255'],
            'documents.*.document_number' => ['nullable', 'string', 'max:255'],
            'documents.*.expiration_date' => ['nullable', 'date'],
            'documents.*.file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:5120'],
            'terms' => ['accepted'],
        ];
    }
}
