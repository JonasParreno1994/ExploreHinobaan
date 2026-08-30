<?php

namespace App\Http\Requests\TourismEnterprise;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEnterpriseServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('enterpriseService')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'enterprise_id' => ['required', 'integer', Rule::exists('enterprises', 'id')->where('user_id', $this->user()->id)],
            'service_type_id' => ['required', 'integer', Rule::exists('service_types', 'id')->where('status', 'active')],
            'name' => ['required', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'pricing_unit' => ['required', Rule::in(['per_night', 'per_day', 'per_hour', 'per_person', 'per_session', 'per_package', 'per_event', 'per_service'])],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'quantity' => ['required', 'integer', 'min:1'],
            'amenities' => ['nullable', 'array', 'max:30'],
            'amenities.*' => ['string', 'max:100'],
            'main_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'gallery_images' => ['nullable', 'array', 'max:10'],
            'gallery_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'reservation_required' => ['required', 'boolean'],
            'reservation_mode' => ['nullable', Rule::in(['overnight', 'day', 'timeslot', 'session'])],
            'pool_type' => ['nullable', Rule::in(['private', 'shared'])],
            'check_in_time' => ['nullable', 'date_format:H:i'],
            'check_out_time' => ['nullable', 'date_format:H:i'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'sessions' => ['nullable', 'array', 'max:12'],
            'sessions.*.id' => ['nullable', 'integer'],
            'sessions.*.name' => ['required', 'string', 'max:100'],
            'sessions.*.start_time' => ['required', 'date_format:H:i'],
            'sessions.*.end_time' => ['required', 'date_format:H:i', 'after:sessions.*.start_time'],
            'sessions.*.price' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'sessions.*.capacity' => ['nullable', 'integer', 'min:1'],
            'sessions.*.is_active' => ['required', 'boolean'],
        ];
    }
}
