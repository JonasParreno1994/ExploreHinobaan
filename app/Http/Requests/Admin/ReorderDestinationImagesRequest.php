<?php

namespace App\Http\Requests\Admin;

use App\Models\Destination;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderDestinationImagesRequest extends FormRequest
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
            'image_ids' => ['required', 'array'],
            'image_ids.*' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('destination_images', 'id')->where(
                    'destination_id',
                    $this->route('destination') instanceof Destination ? $this->route('destination')->getKey() : $this->route('destination'),
                ),
            ],
        ];
    }
}
