<?php

namespace App\Http\Requests\TourismEnterprise;

use App\Models\EnterpriseTourPackage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnterpriseTourItineraryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $enterprise = $this->route('enterprise');

        return $enterprise?->user_id === $this->user()?->id
            && $enterprise->application_status === 'approved'
            && in_array($enterprise->enterpriseType?->name, ['Tour Guide', 'Tour Operator'], true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'enterprise_tour_package_id' => ['required', Rule::exists((new EnterpriseTourPackage)->getTable(), 'id')->where('enterprise_id', $this->route('enterprise')?->id)],
            'time' => ['nullable', 'date_format:H:i'],
            'activity' => ['required', 'string', 'max:150'],
            'destination' => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:10000'],
        ];
    }
}
