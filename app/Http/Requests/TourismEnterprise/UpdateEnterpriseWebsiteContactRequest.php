<?php

namespace App\Http\Requests\TourismEnterprise;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEnterpriseWebsiteContactRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'website' => ['nullable', 'url:http,https', 'max:2048'],
            'social_links' => ['array'],
            'social_links.*.platform' => ['required', Rule::in(['facebook', 'instagram', 'tiktok', 'youtube', 'x'])],
            'social_links.*.url' => ['nullable', 'url:http,https', 'max:2048'],
        ];
    }
}
