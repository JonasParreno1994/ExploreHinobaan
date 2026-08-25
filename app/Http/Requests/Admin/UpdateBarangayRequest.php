<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBarangayRequest extends FormRequest
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
            'psgc_code' => ['required', 'string', 'size:10', 'regex:/^[0-9]+$/', Rule::unique('barangays')->ignore($this->route('barangay'))],
            'name' => ['required', 'string', 'max:255', Rule::unique('barangays')->ignore($this->route('barangay'))],
            'classification' => ['required', Rule::in(['urban', 'rural'])],
            'population' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}
