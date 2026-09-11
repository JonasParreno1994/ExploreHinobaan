<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\TourismEnterprise\UpdateCommerceSettingsRequest;
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

    public function updateCommerceSettings(UpdateCommerceSettingsRequest $request, Enterprise $enterprise): RedirectResponse
    {
        $enterprise->orderSetting()->updateOrCreate([], $request->validated());

        return back()->with('success', 'Local product order settings updated.');
    }
}
