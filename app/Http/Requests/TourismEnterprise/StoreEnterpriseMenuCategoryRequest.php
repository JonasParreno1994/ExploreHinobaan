<?php

namespace App\Http\Requests\TourismEnterprise;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEnterpriseMenuCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $enterprise = $this->route('enterprise');

        return $enterprise?->user_id === $this->user()?->id
            && $enterprise->application_status === 'approved'
            && in_array($enterprise->enterpriseType?->name, ['Cafe', 'Restaurant'], true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
