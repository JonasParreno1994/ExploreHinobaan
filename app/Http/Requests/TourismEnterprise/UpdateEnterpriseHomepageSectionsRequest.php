<?php

namespace App\Http\Requests\TourismEnterprise;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEnterpriseHomepageSectionsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $enterprise = $this->route('enterprise');

        return $enterprise?->user_id === $this->user()?->id && $enterprise->application_status === 'approved';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sections' => ['required', 'array', 'min:1', 'max:20'],
            'sections.*.id' => ['required', 'integer'],
            'sections.*.title' => ['nullable', 'string', 'max:120'],
            'sections.*.subtitle' => ['nullable', 'string', 'max:200'],
            'sections.*.content' => ['nullable', 'string', 'max:10000'],
            'sections.*.is_visible' => ['required', 'boolean'],
            'sections.*.sort_order' => ['required', 'integer', 'min:0', 'max:10000'],
            'sections.*.settings' => ['nullable', 'array'],
            'sections.*.settings.featured_ids' => ['nullable', 'array', 'max:12'],
            'sections.*.settings.featured_ids.*' => ['integer', 'min:1'],
        ];
    }
}
