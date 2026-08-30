<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SecurityEvent;
use App\Models\SecurityIncident;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SecurityMonitoringController extends Controller
{
    public function __invoke(): Response
    {
        $since = now()->subDay();
        $activeSince = now()->subMinutes(15)->timestamp;
        $events = SecurityEvent::query();

        $activeSessions = DB::table('sessions')
            ->join('users', 'sessions.user_id', '=', 'users.id')
            ->leftJoin('roles', 'users.role_id', '=', 'roles.id')
            ->where('sessions.last_activity', '>=', $activeSince)
            ->orderByDesc('sessions.last_activity')
            ->limit(20)
            ->get([
                'sessions.ip_address',
                'sessions.user_agent',
                'sessions.last_activity',
                'users.name',
                'users.email',
                'roles.name as role_name',
            ]);

        return Inertia::render('admin/security-monitoring/index', [
            'statistics' => [
                'total_events' => (clone $events)->where('detected_at', '>=', $since)->count(),
                'suspicious_events' => (clone $events)->where('detected_at', '>=', $since)->where('risk_score', '>=', 40)->count(),
                'critical_alerts' => (clone $events)->where('detected_at', '>=', $since)->where('severity', 'critical')->count(),
                'blocked_requests' => (clone $events)->where('detected_at', '>=', $since)->whereIn('decision', ['block', 'rate_limit', 'terminate_session'])->count(),
                'failed_logins' => (clone $events)->where('detected_at', '>=', $since)->where('event_type', 'failed_login')->count(),
                'suspicious_sessions' => DB::table('sessions')->where('last_activity', '>=', $activeSince)->whereIn('ip_address', SecurityEvent::query()->where('risk_score', '>=', 65)->where('detected_at', '>=', $since)->select('ip_address'))->count(),
                'inactive_accounts' => User::query()->where('status', '!=', 'active')->count(),
            ],
            'securityEvents' => (clone $events)->with('user:id,name,email')->latest('detected_at')->limit(50)->get(),
            'idsAlerts' => (clone $events)->whereNotNull('attack_type')->latest('detected_at')->limit(20)->get(),
            'zeroTrustDecisions' => (clone $events)->selectRaw('decision, count(*) as total')->groupBy('decision')->orderByDesc('total')->get(),
            'incidents' => SecurityIncident::query()->with(['event:id,event_type,attack_type,ip_address,risk_score', 'assignee:id,name'])->latest()->limit(25)->get(),
            'analytics' => [
                'severity' => (clone $events)->selectRaw('severity as label, count(*) as total')->groupBy('severity')->orderByDesc('total')->get(),
                'attacks' => (clone $events)->whereNotNull('attack_type')->selectRaw('attack_type as label, count(*) as total')->groupBy('attack_type')->orderByDesc('total')->limit(8)->get(),
                'endpoints' => (clone $events)->selectRaw('endpoint as label, count(*) as total')->groupBy('endpoint')->orderByDesc('total')->limit(8)->get(),
                'ips' => (clone $events)->where('risk_score', '>=', 40)->selectRaw('ip_address as label, count(*) as total')->groupBy('ip_address')->orderByDesc('total')->limit(8)->get(),
            ],
            'auditLogs' => AuditLog::query()->latest('id')->limit(10)->get(['id', 'actor_name', 'actor_email', 'action', 'path', 'ip_address', 'created_at']),
            'activeSessions' => $activeSessions,
        ]);
    }
}
