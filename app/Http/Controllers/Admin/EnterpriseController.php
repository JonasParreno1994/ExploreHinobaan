<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectEnterpriseRequest;
use App\Http\Requests\Admin\VerifyEnterpriseDocumentRequest;
use App\Models\Enterprise;
use App\Models\EnterpriseDocument;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EnterpriseController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $status = in_array($status, ['pending', 'approved', 'rejected', 'suspended'], true) ? $status : '';
        $search = $request->string('search')->squish()->toString();

        $enterprises = Enterprise::query()
            ->select(['id', 'enterprise_type_id', 'barangay_id', 'business_name', 'slug', 'contact_person', 'email', 'phone', 'address', 'logo', 'application_status', 'approved_at', 'created_at'])
            ->with(['enterpriseType:id,name', 'barangay:id,name'])
            ->withCount('documents')
            ->when($status !== '', fn (Builder $query): Builder => $query->where('application_status', $status))
            ->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query
                ->whereLike('business_name', "%{$search}%")
                ->orWhereLike('contact_person', "%{$search}%")
                ->orWhereLike('email', "%{$search}%")
                ->orWhereLike('license_number', "%{$search}%")))
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        $counts = Enterprise::query()
            ->selectRaw('application_status, count(*) as aggregate')
            ->groupBy('application_status')
            ->pluck('aggregate', 'application_status');

        return Inertia::render('admin/enterprises/index', [
            'enterprises' => $enterprises,
            'filters' => ['status' => $status, 'search' => $search],
            'counts' => [
                'all' => Enterprise::query()->count(),
                'pending' => (int) ($counts['pending'] ?? 0),
                'approved' => (int) ($counts['approved'] ?? 0),
                'rejected' => (int) ($counts['rejected'] ?? 0),
                'suspended' => (int) ($counts['suspended'] ?? 0),
            ],
        ]);
    }

    public function show(Enterprise $enterprise): Response
    {
        $enterprise->load([
            'user:id,name,email,phone',
            'enterpriseType:id,name',
            'barangay:id,name',
            'approver:id,name',
            'documents',
        ]);

        return Inertia::render('admin/enterprises/show', ['enterprise' => $enterprise]);
    }

    public function approve(Request $request, Enterprise $enterprise): RedirectResponse
    {
        DB::transaction(fn () => $enterprise->update([
            'application_status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->getKey(),
            'rejection_reason' => null,
        ]));

        return back()->with('success', 'Enterprise application approved successfully.');
    }

    public function reject(RejectEnterpriseRequest $request, Enterprise $enterprise): RedirectResponse
    {
        $enterprise->update([
            'application_status' => 'rejected',
            'approved_at' => null,
            'approved_by' => null,
            'rejection_reason' => $request->validated('rejection_reason'),
        ]);

        return back()->with('success', 'Enterprise application rejected.');
    }

    public function suspend(Enterprise $enterprise): RedirectResponse
    {
        $enterprise->update(['application_status' => 'suspended']);

        return back()->with('success', 'Enterprise suspended successfully.');
    }

    public function reactivate(Request $request, Enterprise $enterprise): RedirectResponse
    {
        $enterprise->update([
            'application_status' => 'approved',
            'approved_at' => $enterprise->approved_at ?? now(),
            'approved_by' => $enterprise->approved_by ?? $request->user()->getKey(),
            'rejection_reason' => null,
        ]);

        return back()->with('success', 'Enterprise reactivated successfully.');
    }

    public function verifyDocument(
        VerifyEnterpriseDocumentRequest $request,
        Enterprise $enterprise,
        EnterpriseDocument $document,
    ): RedirectResponse {
        abort_unless($document->enterprise_id === $enterprise->id, 404);
        $document->update($request->validated());

        return back()->with('success', 'Document verification updated successfully.');
    }
}
