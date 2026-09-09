<?php

namespace App\Http\Requests\TourismEnterprise;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEnterpriseWebsiteSeoRequest extends FormRequest
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
            'seo_title' => ['nullable', 'string', 'max:60'],
            'seo_description' => ['nullable', 'string', 'max:160'],
            'social_title' => ['nullable', 'string', 'max:95'],
            'social_description' => ['nullable', 'string', 'max:200'],
            'social_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'dimensions:min_width=1200,min_height=630,max_width=2400,max_height=1260', 'max:5120'],
            'remove_social_image' => ['sometimes', 'boolean'],
        ];
    }
}
