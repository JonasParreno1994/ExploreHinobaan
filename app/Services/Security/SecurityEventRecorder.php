<?php

namespace App\Services\Security;

use App\Models\SecurityEvent;
use App\Models\SecurityIncident;
use Illuminate\Http\Request;

class SecurityEventRecorder
{
    /** @param array<string, mixed> $metadata */
    public function record(Request $request, string $eventType, string $result, ?string $affectedResource = null, array $metadata = []): SecurityEvent
    {
        $assessment = $this->assess($request, $eventType);
        $user = $request->user();

        $event = SecurityEvent::create([
            'user_id' => $user?->id,
            'event_type' => $eventType,
            'attack_type' => $assessment['attack_type'],
            'severity' => $assessment['severity'],
            'risk_score' => $assessment['risk_score'],
            'decision' => $assessment['decision'],
            'result' => $result,
            'role_name' => $user?->role?->name,
            'endpoint' => $request->path(),
            'method' => $request->method(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'affected_resource' => $affectedResource,
            'explanation' => $assessment['explanation'],
            'metadata' => $metadata,
            'detected_at' => now(),
        ]);

        if (in_array($event->severity, ['high', 'critical'], true)) {
            SecurityIncident::firstOrCreate(
                ['security_event_id' => $event->id],
                ['title' => $this->title($eventType), 'description' => $this->description($event), 'severity' => $event->severity],
            );
        }

        return $event;
    }

    /** @return array{attack_type: ?string, severity: string, risk_score: int, decision: string, explanation: list<array{feature: string, contribution: int, reason: string}>} */
    private function assess(Request $request, string $eventType): array
    {
        $failedAttempts = SecurityEvent::query()->where('event_type', 'failed_login')->where('ip_address', $request->ip())->where('detected_at', '>=', now()->subMinutes(15))->count();
        $baseScores = ['login_success' => 5, 'sensitive_change' => 25, 'failed_login' => 35, 'authorization_violation' => 75, 'rate_limited' => 90, 'session_terminated' => 45];
        $score = $baseScores[$eventType] ?? 15;
        $explanation = [['feature' => 'event_type', 'contribution' => $score, 'reason' => "Baseline for {$eventType}"]];

        if ($eventType === 'failed_login' && $failedAttempts >= 2) {
            $score += min(45, $failedAttempts * 10);
            $explanation[] = ['feature' => 'repeated_attempts', 'contribution' => min(45, $failedAttempts * 10), 'reason' => "{$failedAttempts} recent failures from this IP"];
        }

        $score = min(100, $score);
        $severity = match (true) {
            $score >= 85 => 'critical', $score >= 65 => 'high', $score >= 40 => 'medium', $score >= 20 => 'low', default => 'informational'
        };
        $decision = match (true) {
            $score >= 85 => 'block', $score >= 65 => 're_authenticate', $score >= 40 => 'rate_limit', $score >= 20 => 'monitor', default => 'allow'
        };
        $attackType = match ($eventType) {
            'failed_login', 'rate_limited' => 'credential_attack', 'authorization_violation' => 'broken_access_control', default => null
        };

        return ['attack_type' => $attackType, 'severity' => $severity, 'risk_score' => $score, 'decision' => $decision, 'explanation' => $explanation];
    }

    private function title(string $eventType): string
    {
        return match ($eventType) {
            'authorization_violation' => 'Authorization violation detected', 'rate_limited' => 'Repeated authentication attempts blocked', default => 'Suspicious authentication activity'
        };
    }

    private function description(SecurityEvent $event): string
    {
        return "Rules-based detection assigned risk {$event->risk_score}/100 to {$event->event_type} from IP ".($event->ip_address ?? 'unknown').'.';
    }
}
