<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $enterprises = $request->user()->enterprises()
            ->with(['enterpriseType:id,name', 'barangay:id,name'])
            ->withCount(['documents', 'services', 'reservations'])
            ->latest('id')
            ->get();

        return Inertia::render('tourism-enterprise/enterprises/index', ['enterprises' => $enterprises]);
    }
}
