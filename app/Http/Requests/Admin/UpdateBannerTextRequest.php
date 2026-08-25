<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBannerTextRequest extends FormRequest
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
            'header_1' => ['nullable', 'string', 'max:255'],
            'header_2' => ['nullable', 'string', 'max:255'],
            'header_3' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
