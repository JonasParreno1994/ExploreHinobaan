<?php

namespace App\Http\Controllers\TourismEnterprise;

use App\Http\Controllers\Controller;
use App\Models\EnterpriseDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseDocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $documents = EnterpriseDocument::query()
            ->whereHas('enterprise', fn ($query) => $query->where('user_id', $request->user()->id))
            ->with('enterprise:id,business_name')
            ->latest()
            ->get();

        return Inertia::render('tourism-enterprise/documents/index', ['documents' => $documents]);
    }
}
