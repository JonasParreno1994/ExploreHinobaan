<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TrackEnterpriseWebsiteEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'event_type' => ['required', Rule::in(['reservation_click', 'direction_click', 'contact_click', 'social_click', 'content_view'])],
            'target_type' => ['nullable', Rule::in(['service', 'product', 'room', 'tour', 'menu', 'social'])],
            'target_id' => ['nullable', 'integer'],
            'target_label' => ['nullable', 'string', 'max:255'],
        ];
    }
}
