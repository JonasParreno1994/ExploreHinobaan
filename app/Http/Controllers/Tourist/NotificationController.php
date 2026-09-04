<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('tourist/notifications/index', [
            'notifications' => $request->user()->notifications()
                ->latest()
                ->paginate(15)
                ->through(fn (DatabaseNotification $notification): array => [
                    'id' => $notification->id,
                    'data' => $notification->data,
                    'is_read' => $notification->read_at !== null,
                    'created_at' => $notification->created_at?->diffForHumans(),
                    'created_at_exact' => $notification->created_at?->toIso8601String(),
                ]),
        ]);
    }

    public function read(Request $request, DatabaseNotification $notification): RedirectResponse
    {
        $this->authorizeOwner($request, $notification);
        $notification->markAsRead();

        return back();
    }

    public function readAll(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }

    private function authorizeOwner(Request $request, DatabaseNotification $notification): void
    {
        abort_unless($notification->notifiable_type === $request->user()::class && (int) $notification->notifiable_id === $request->user()->id, 403);
    }
}
