<?php

namespace App\Http\Requests\Tourist;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTouristVerificationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isTourist() === true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_type' => ['required', Rule::in(['National ID', "Driver's License", 'Passport', 'PRC ID', 'UMID', 'Postal ID', 'Other Government-Issued ID'])],
            'id_front' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'id_back' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'selfie_with_id' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'privacy_consent' => ['accepted'],
        ];
    }
}
