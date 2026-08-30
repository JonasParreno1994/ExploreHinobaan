<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->verifiedRedirect($request);
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        return $this->verifiedRedirect($request);
    }

    private function verifiedRedirect(EmailVerificationRequest $request): RedirectResponse
    {
        $fallback = $request->user()->isTourist() ? route('tourist.verification.show', absolute: false) : route('dashboard', absolute: false);

        return redirect()->intended($fallback.'?verified=1');
    }
}
