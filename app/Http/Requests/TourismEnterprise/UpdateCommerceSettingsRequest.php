<?php

namespace App\Http\Requests\TourismEnterprise;

use App\Models\Enterprise;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateCommerceSettingsRequest extends FormRequest
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
        return [
            'accepts_pickup' => ['required', 'boolean'],
            'accepts_delivery' => ['required', 'boolean'],
            'delivery_fee' => ['required', 'numeric', 'min:0'],
            'minimum_order_amount' => ['nullable', 'numeric', 'min:0'],
            'accepts_cash_on_pickup' => ['required', 'boolean'],
            'accepts_gcash' => ['required', 'boolean'],
            'estimated_preparation_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'allows_order_cancellation' => ['required', 'boolean'],
            'cancellation_window_hours' => ['nullable', 'integer', 'min:1', 'max:8760'],
            'allows_refunds' => ['required', 'boolean'],
            'refund_window_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ];
    }

    /** @return array<callable> */
    public function after(): array
    {
        return [function (Validator $validator): void {
            if (! $this->boolean('accepts_pickup') && ! $this->boolean('accepts_delivery')) {
                $validator->errors()->add('accepts_pickup', 'Enable at least one fulfillment method.');
            }

            if (! $this->boolean('accepts_cash_on_pickup') && ! $this->boolean('accepts_gcash')) {
                $validator->errors()->add('accepts_cash_on_pickup', 'Enable at least one payment method.');
            }
        }];
    }
}
