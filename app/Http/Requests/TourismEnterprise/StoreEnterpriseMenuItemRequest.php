<?php

namespace App\Http\Requests\TourismEnterprise;

use App\Models\EnterpriseMenuCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnterpriseMenuItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $enterprise = $this->route('enterprise');

        return $enterprise?->user_id === $this->user()?->id
            && $enterprise->application_status === 'approved'
            && in_array($enterprise->enterpriseType?->name, ['Cafe', 'Restaurant'], true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'enterprise_menu_category_id' => [
                'required',
                Rule::exists((new EnterpriseMenuCategory)->getTable(), 'id')->where('enterprise_id', $this->route('enterprise')?->id),
            ],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096', 'dimensions:min_width=300,min_height=300,max_width=5000,max_height=5000'],
            'is_available' => ['required', 'boolean'],
            'is_featured' => ['required', 'boolean'],
            'is_best_seller' => ['required', 'boolean'],
            'is_new' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:10000'],
        ];
    }
}
