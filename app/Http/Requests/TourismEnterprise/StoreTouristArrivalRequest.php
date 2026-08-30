<?php

namespace App\Http\Requests\TourismEnterprise;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTouristArrivalRequest extends FormRequest
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
            'enterprise_id' => ['required', 'integer'], 'reservation_id' => ['nullable', 'integer'], 'enterprise_service_id' => ['nullable', 'integer'],
            'arrival_date' => ['required', 'date', 'before_or_equal:today'], 'check_in_date' => ['nullable', 'date'], 'check_out_date' => ['nullable', 'date', 'after:check_in_date'],
            'booking_source' => ['required', Rule::in(['website_reservation', 'walk_in', 'direct_booking', 'phone_booking', 'other'])],
            'visitor_type' => ['required', Rule::in(['domestic', 'foreign'])], 'country' => ['required', 'string', 'max:100'],
            'province' => ['nullable', 'required_if:visitor_type,domestic', 'string', 'max:100'], 'city_municipality' => ['nullable', 'required_if:visitor_type,domestic', 'string', 'max:100'],
            'adults' => ['required', 'integer', 'min:0'], 'children' => ['required', 'integer', 'min:0'],
            'visit_type' => ['required', Rule::in(['overnight', 'day_visit', 'tour_participant'])],
            'arrival_type' => ['required', Rule::in(['accommodation_checkin', 'day_visit', 'tour_participation'])],
            'purpose_of_visit' => ['nullable', 'string', 'max:100'], 'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
