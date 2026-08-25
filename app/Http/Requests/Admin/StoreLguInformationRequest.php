<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreLguInformationRequest extends FormRequest
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
            'history' => ['required', 'string'],
            'mission' => ['required', 'string'],
            'vision' => ['required', 'string'],
            'area' => ['required', 'numeric', 'min:0'],
            'number_of_barangays' => ['required', 'integer', 'min:1'],
            'location' => ['required', 'string', 'max:255'],
            'images' => ['required', 'array', 'min:5', 'max:10'],
            'images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
