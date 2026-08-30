<?php

namespace App\Http\Requests\TourismEnterprise;

use App\Models\Enterprise;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $enterprise = $this->route('enterprise');

        return $enterprise instanceof Enterprise && $enterprise->user_id === $this->user()?->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return ['reservation_fee' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'], 'gcash_qr' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120']];
    }
}
