<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\RequiredIf;

class VerifyEnterpriseDocumentRequest extends FormRequest
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
            'verification_status' => ['required', Rule::in(['verified', 'rejected'])],
            'remarks' => [new RequiredIf($this->input('verification_status') === 'rejected'), 'nullable', 'string', 'max:5000'],
        ];
    }
}
