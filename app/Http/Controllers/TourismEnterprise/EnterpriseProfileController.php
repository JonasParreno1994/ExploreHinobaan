<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\UpdatePaymentSettingsRequest;
use App\Models\Enterprise;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $enterprises = $request->user()->enterprises()
            ->with(['enterpriseType:id,name', 'barangay:id,name', 'orderSetting'])
            ->withCount(['documents', 'services', 'reservations'])
            ->latest('id')
            ->get();

        return Inertia::render('tourism-enterprise/enterprises/index', ['enterprises' => $enterprises]);
    }

    public function updatePaymentSettings(UpdatePaymentSettingsRequest $request, Enterprise $enterprise): RedirectResponse
    {
        $data = ['reservation_fee' => $request->validated('reservation_fee')];
        if ($request->hasFile('gcash_qr')) {
            $data['gcash_qr_path'] = $request->file('gcash_qr')->store('enterprises/gcash', 'public');
        }
        $enterprise->update($data);

        return back()->with('success', 'Payment settings updated.');
    }

    public function updateCommerceSettings(Request $request, Enterprise $enterprise): RedirectResponse
    {
        abort_unless($enterprise->user_id === $request->user()->id, 403);
        $data = $request->validate(['accepts_pickup' => ['required', 'boolean'], 'accepts_delivery' => ['required', 'boolean'], 'delivery_fee' => ['required', 'numeric', 'min:0'], 'accepts_cash_on_pickup' => ['required', 'boolean'], 'accepts_gcash' => ['required', 'boolean'], 'estimated_preparation_days' => ['nullable', 'integer', 'min:0', 'max:365']]);
        $enterprise->orderSetting()->updateOrCreate([], $data);

        return back()->with('success', 'Local product order settings updated.');
    }
}
