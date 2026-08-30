<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWhyVisitSectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'eyebrow' => ['required', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:150'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'cards' => ['required', 'array', 'min:1', 'max:8'],
            'cards.*.title' => ['required', 'string', 'max:100'],
            'cards.*.description' => ['required', 'string', 'max:500'],
            'cards.*.icon' => ['required', Rule::in(['trees', 'sparkles', 'compass', 'umbrella', 'waves', 'mountain', 'heart', 'camera'])],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}
