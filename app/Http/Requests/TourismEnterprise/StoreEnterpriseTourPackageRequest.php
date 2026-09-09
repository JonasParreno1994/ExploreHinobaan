<?php

namespace App\Http\Requests\TourismEnterprise;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEnterpriseTourPackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $enterprise = $this->route('enterprise');

        return $enterprise?->user_id === $this->user()?->id
            && $enterprise->application_status === 'approved'
            && in_array($enterprise->enterpriseType?->name, ['Tour Guide', 'Tour Operator'], true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:5000'],
            'rate' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'inclusions' => ['nullable', 'string', 'max:5000'],
            'exclusions' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096', 'dimensions:min_width=500,min_height=300,max_width=5000,max_height=5000'],
            'is_available' => ['required', 'boolean'],
            'is_featured' => ['required', 'boolean'],
        ];
    }
}
