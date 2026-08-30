<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\Security\SecurityEventRecorder;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Routing\UrlRoutable;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class RecordUserActivity
{
    public function __construct(private SecurityEventRecorder $securityEvents) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $actor = $request->user();
        try {
            $response = $next($request);
        } catch (AuthorizationException|HttpExceptionInterface $exception) {
            $isForbidden = $exception instanceof AuthorizationException || $exception->getStatusCode() === 403;
            if ($isForbidden && $actor instanceof User) {
                $this->securityEvents->record($request, 'authorization_violation', 'denied', $request->route()?->getName(), ['response_status' => 403]);
            }

            throw $exception;
        }
        $actor ??= $request->user();

        if ($actor instanceof User && $this->shouldRecord($request, $response)) {
            AuditLog::create([
                'user_id' => $actor->id,
                'actor_name' => $actor->name,
                'actor_email' => $actor->email,
                'action' => $this->action($request),
                'method' => $request->method(),
                'route_name' => $request->route()?->getName(),
                'path' => $request->path(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => [
                    'changed_fields' => collect($request->except(['_token', 'password', 'password_confirmation', 'token']))->keys()->values()->all(),
                    'route_parameters' => collect($request->route()?->parameters() ?? [])->map(
                        fn (mixed $value): mixed => $value instanceof UrlRoutable ? $value->getRouteKey() : $value,
                    )->all(),
                    'response_status' => $response->getStatusCode(),
                ],
            ]);

            if ($this->isSensitiveChange($request)) {
                $this->securityEvents->record($request, 'sensitive_change', 'allowed', $request->route()?->getName());
            }

            if ($this->action($request) === 'logged_in') {
                $this->securityEvents->record($request, 'login_success', 'allowed');
            }
        }

        return $response;
    }

    private function isSensitiveChange(Request $request): bool
    {
        return ! $request->isMethodSafe() && ($request->is('admin/users*') || $request->is('admin/roles*') || $request->is('admin/settings*'));
    }

    private function shouldRecord(Request $request, Response $response): bool
    {
        return ! $request->isMethodSafe() && $response->getStatusCode() < 400;
    }

    private function action(Request $request): string
    {
        if ($request->is('login') && $request->isMethod('post')) {
            return 'logged_in';
        }

        if ($request->is('logout')) {
            return 'logged_out';
        }

        return match ($request->method()) {
            'POST' => 'created',
            'PUT', 'PATCH' => 'updated',
            'DELETE' => 'deleted',
            default => 'performed',
        };
    }
}
