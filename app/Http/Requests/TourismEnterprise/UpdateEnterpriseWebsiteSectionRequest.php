<?php

namespace App\Http\Requests\TourismEnterprise;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEnterpriseWebsiteSectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $enterprise = $this->route('enterprise');

        return $enterprise && $enterprise->user_id === $this->user()?->id && $enterprise->application_status === 'approved';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:120'],
            'subtitle' => ['nullable', 'string', 'max:200'],
            'content' => ['nullable', 'string', 'max:10000'],
            'is_visible' => ['required', 'boolean'],
        ];
    }
}
