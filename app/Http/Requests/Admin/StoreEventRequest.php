<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
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
            'barangay_id' => ['nullable', 'integer', Rule::exists('barangays', 'id')],
            'title' => ['required', 'string', 'max:255'],
            'event_type' => ['required', Rule::in(['Festival', 'Cultural Event', 'Tourism Event', 'Sports Event', 'Community Event', 'Municipal Event', 'Barangay Event', 'Other'])],
            'short_description' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string', 'max:50000'],
            'venue' => ['required', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
            'featured_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'registration_link' => ['nullable', 'url:http,https', 'max:2048'],
            'organizer' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'is_featured' => ['required', 'boolean'],
        ];
    }
}
