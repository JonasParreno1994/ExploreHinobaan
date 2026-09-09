<?php

namespace App\Http\Controllers;

use App\Models\EnterpriseDocument;
use App\Models\LocalProductOrder;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SensitiveFileController extends Controller
{
    public function enterpriseDocument(Request $request, EnterpriseDocument $enterpriseDocument): StreamedResponse
    {
        $enterpriseDocument->loadMissing('enterprise:id,user_id');
        abort_unless($this->isTourismOfficer($request->user()) || $enterpriseDocument->enterprise->user_id === $request->user()->id, 403);

        return $this->privateResponse($enterpriseDocument->file_path);
    }

    public function reservationPaymentProof(Request $request, Reservation $reservation): StreamedResponse
    {
        $reservation->loadMissing('enterprise:id,user_id');
        abort_unless(
            $this->isTourismOfficer($request->user())
            || $reservation->enterprise->user_id === $request->user()->id
            || $reservation->customer_id === $request->user()->id,
            403,
        );

        return $this->privateResponse($reservation->payment_proof_path);
    }

    public function productOrderPaymentProof(Request $request, LocalProductOrder $localProductOrder): StreamedResponse
    {
        $localProductOrder->loadMissing('enterprise:id,user_id');
        abort_unless(
            $this->isTourismOfficer($request->user())
            || $localProductOrder->enterprise->user_id === $request->user()->id
            || $localProductOrder->customer_id === $request->user()->id,
            403,
        );

        return $this->privateResponse($localProductOrder->payment_proof_path);
    }

    private function privateResponse(?string $path): StreamedResponse
    {
        abort_unless(filled($path), 404);
        $disk = $this->diskContaining($path);
        abort_unless($disk, 404);

        return $disk->response($path, null, [
            'Cache-Control' => 'no-store, private',
            'Content-Security-Policy' => "default-src 'none'; sandbox",
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function diskContaining(string $path): ?FilesystemAdapter
    {
        if (Storage::disk('local')->exists($path)) {
            return Storage::disk('local');
        }

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public');
        }

        return null;
    }

    private function isTourismOfficer(User $user): bool
    {
        return in_array($user->role?->name, ['Administrator', 'Tourism Staff'], true);
    }
}
