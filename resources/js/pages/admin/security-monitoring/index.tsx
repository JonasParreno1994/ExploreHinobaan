import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePoll } from '@inertiajs/react';
import { Activity, Ban, BrainCircuit, KeyRound, MonitorCheck, ShieldAlert, Siren } from 'lucide-react';

type Count = { label: string | null; total: number };
type Event = {
    id: number;
    event_type: string;
    attack_type: string | null;
    severity: string;
    risk_score: number;
    decision: string;
    result: string;
    role_name: string | null;
    endpoint: string;
    method: string;
    ip_address: string | null;
    affected_resource: string | null;
    explanation: { feature: string; contribution: number; reason: string }[] | null;
    detected_at: string;
    user: { name: string; email: string } | null;
};
type Incident = {
    id: number;
    title: string;
    description: string;
    severity: string;
    status: string;
    notes: string | null;
    event: { attack_type: string | null; ip_address: string | null; risk_score: number } | null;
    assignee: { name: string } | null;
    created_at: string;
};
type Session = { name: string; email: string; role_name: string | null; ip_address: string | null; last_activity: number };
type Audit = { id: number; actor_name: string; actor_email: string; action: string; path: string; ip_address: string | null; created_at: string };

interface Props {
    statistics: {
        total_events: number;
        suspicious_events: number;
        critical_alerts: number;
        blocked_requests: number;
        failed_logins: number;
        suspicious_sessions: number;
        inactive_accounts: number;
    };
    securityEvents: Event[];
    idsAlerts: Event[];
    zeroTrustDecisions: { decision: string; total: number }[];
    incidents: Incident[];
    analytics: { severity: Count[]; attacks: Count[]; endpoints: Count[]; ips: Count[] };
    activeSessions: Session[];
    auditLogs: Audit[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Security Monitoring', href: '/admin/security-monitoring' },
];
const severityClass: Record<string, string> = {
    critical: 'bg-red-600 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-amber-100 text-amber-900',
    low: 'bg-sky-100 text-sky-800',
    informational: 'bg-slate-100 text-slate-700',
};

export default function SecurityMonitoring(props: Props) {
    usePoll(15000, { only: ['statistics', 'securityEvents', 'idsAlerts', 'incidents', 'activeSessions', 'analytics', 'zeroTrustDecisions'] });
    const cards = [
        ['Total events', props.statistics.total_events, Activity, 'text-slate-700'],
        ['Suspicious events', props.statistics.suspicious_events, ShieldAlert, 'text-orange-600'],
        ['Critical alerts', props.statistics.critical_alerts, Siren, 'text-red-600'],
        ['Blocked requests', props.statistics.blocked_requests, Ban, 'text-red-700'],
        ['Failed logins', props.statistics.failed_logins, KeyRound, 'text-amber-600'],
        ['Suspicious sessions', props.statistics.suspicious_sessions, MonitorCheck, 'text-purple-600'],
    ] as const;

    function updateIncident(incident: Incident, status: string): void {
        router.patch(`/admin/security-incidents/${incident.id}`, { status, notes: incident.notes }, { preserveScroll: true });
    }

    return (
        <AdminLayout title="Security Monitoring" breadcrumbs={breadcrumbs}>
            <Head title="Security Monitoring" />
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <ShieldAlert className="size-7 text-emerald-700" /> Security Monitoring
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Rules-based intrusion detection and Zero Trust decision monitoring. Refreshes every 15 seconds.
                    </p>
                </div>
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {cards.map(([label, value, Icon, color]) => (
                        <Card key={label} className="border-emerald-950/10">
                            <CardContent className="flex items-start justify-between gap-2 p-4">
                                <div>
                                    <p className="text-muted-foreground text-xs font-medium uppercase">{label}</p>
                                    <p className="mt-2 text-3xl font-bold">{value}</p>
                                    <p className="text-muted-foreground mt-1 text-xs">Last 24 hours</p>
                                </div>
                                <Icon className={`size-5 ${color}`} />
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <Card className="overflow-hidden border-emerald-950/10">
                    <CardHeader>
                        <CardTitle>Live Security Events</CardTitle>
                        <CardDescription>Timestamp, actor, endpoint, result, rules-based risk score, and Zero Trust decision.</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto p-0">
                        <table className="w-full min-w-[1050px] text-sm">
                            <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase dark:bg-slate-900">
                                <tr>
                                    {['Timestamp', 'User / Role', 'IP', 'Endpoint / Action', 'Result', 'Risk', 'Severity', 'Decision'].map((x) => (
                                        <th key={x} className="px-4 py-3">
                                            {x}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {props.securityEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td className="px-4 py-3 whitespace-nowrap">{new Date(event.detected_at).toLocaleString('en-PH')}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{event.user?.name ?? 'Unauthenticated'}</p>
                                            <p className="text-muted-foreground text-xs">{event.role_name ?? 'No role'}</p>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">{event.ip_address ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">
                                                {event.method} /{event.endpoint}
                                            </p>
                                            <p className="text-muted-foreground text-xs">{event.event_type.replaceAll('_', ' ')}</p>
                                        </td>
                                        <td className="px-4 py-3 capitalize">{event.result}</td>
                                        <td className="px-4 py-3 font-bold">{event.risk_score}/100</td>
                                        <td className="px-4 py-3">
                                            <Badge className={severityClass[event.severity]}>{event.severity}</Badge>
                                        </td>
                                        <td className="px-4 py-3 capitalize">{event.decision.replaceAll('_', ' ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!props.securityEvents.length && (
                            <p className="text-muted-foreground p-10 text-center">No structured security events recorded yet.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-emerald-950/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit className="size-5 text-purple-600" /> IDS Alerts
                            </CardTitle>
                            <CardDescription>Rules-based predictions. This is not presented as a trained AI model.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {props.idsAlerts.map((alert) => (
                                <article key={alert.id} className="rounded-xl border p-4">
                                    <div className="flex flex-wrap justify-between gap-2">
                                        <div>
                                            <p className="font-semibold capitalize">{alert.attack_type?.replaceAll('_', ' ')}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {alert.affected_resource ?? `/${alert.endpoint}`} · IP {alert.ip_address ?? 'unknown'}
                                            </p>
                                        </div>
                                        <Badge className={severityClass[alert.severity]}>{alert.risk_score}/100</Badge>
                                    </div>
                                    <div className="mt-3 space-y-1 border-t pt-3">
                                        {alert.explanation?.map((item) => (
                                            <p key={`${alert.id}-${item.feature}`} className="text-xs">
                                                <strong>
                                                    {item.feature.replaceAll('_', ' ')} (+{item.contribution})
                                                </strong>
                                                : {item.reason}
                                            </p>
                                        ))}
                                    </div>
                                </article>
                            ))}
                            {!props.idsAlerts.length && <p className="text-muted-foreground text-sm">No IDS alerts.</p>}
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-950/10">
                        <CardHeader>
                            <CardTitle>Zero Trust Decisions</CardTitle>
                            <CardDescription>
                                Allow, monitor, re-authenticate, rate-limit, block, and session actions issued by policy.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {props.zeroTrustDecisions.map((item) => (
                                <div key={item.decision} className="rounded-xl border p-4 text-center">
                                    <p className="text-2xl font-bold">{item.total}</p>
                                    <p className="text-muted-foreground mt-1 text-xs capitalize">{item.decision.replaceAll('_', ' ')}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-emerald-950/10">
                    <CardHeader>
                        <CardTitle>Incident Management</CardTitle>
                        <CardDescription>Track alerts from New through Investigating, Contained, Resolved, or False Positive.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 lg:grid-cols-2">
                        {props.incidents.map((incident) => (
                            <article key={incident.id} className="rounded-xl border p-4">
                                <div className="flex flex-wrap justify-between gap-2">
                                    <div>
                                        <p className="font-semibold">{incident.title}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {incident.event?.attack_type?.replaceAll('_', ' ') ?? 'Security event'} · Risk{' '}
                                            {incident.event?.risk_score ?? 0}/100
                                        </p>
                                    </div>
                                    <Badge className={severityClass[incident.severity]}>{incident.status.replaceAll('_', ' ')}</Badge>
                                </div>
                                <p className="text-muted-foreground mt-3 text-sm">{incident.description}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {['investigating', 'contained', 'resolved', 'false_positive'].map((status) => (
                                        <Button
                                            key={status}
                                            type="button"
                                            size="sm"
                                            variant={incident.status === status ? 'default' : 'outline'}
                                            onClick={() => updateIncident(incident, status)}
                                        >
                                            {status.replaceAll('_', ' ')}
                                        </Button>
                                    ))}
                                </div>
                            </article>
                        ))}
                        {!props.incidents.length && <p className="text-muted-foreground text-sm">No incidents require investigation.</p>}
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Analytics title="Severity distribution" items={props.analytics.severity} />
                    <Analytics title="Attack categories" items={props.analytics.attacks} />
                    <Analytics title="Top targeted endpoints" items={props.analytics.endpoints} />
                    <Analytics title="Top suspicious IPs" items={props.analytics.ips} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-emerald-950/10">
                        <CardHeader>
                            <CardTitle>Authentication Monitoring</CardTitle>
                            <CardDescription>Currently active authenticated sessions.</CardDescription>
                        </CardHeader>
                        <CardContent className="divide-y p-0">
                            {props.activeSessions.map((session, index) => (
                                <div key={`${session.email}-${index}`} className="p-4">
                                    <div className="flex justify-between gap-2">
                                        <p className="font-medium">{session.name}</p>
                                        <Badge variant="secondary">{session.role_name ?? 'No role'}</Badge>
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        {session.email} · IP {session.ip_address ?? 'unknown'}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-950/10">
                        <CardHeader>
                            <CardTitle>Audit Logs</CardTitle>
                            <CardDescription>Recent sensitive and authenticated actions.</CardDescription>
                        </CardHeader>
                        <CardContent className="divide-y p-0">
                            {props.auditLogs.map((log) => (
                                <div key={log.id} className="p-4">
                                    <div className="flex justify-between gap-2">
                                        <p className="font-medium">
                                            {log.actor_name} · {log.action.replaceAll('_', ' ')}
                                        </p>
                                        <time className="text-muted-foreground text-xs">{new Date(log.created_at).toLocaleString('en-PH')}</time>
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        /{log.path} · IP {log.ip_address ?? 'unknown'}
                                    </p>
                                </div>
                            ))}
                            <div className="p-4 text-right">
                                <Link href="/admin/audit-logs" className="font-semibold text-emerald-700">
                                    View all audit logs →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

function Analytics({ title, items }: { title: string; items: Count[] }) {
    const maximum = Math.max(1, ...items.map((item) => Number(item.total)));
    return (
        <Card className="border-emerald-950/10">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.map((item) => (
                    <div key={item.label ?? 'unknown'}>
                        <div className="mb-1 flex justify-between gap-3 text-sm">
                            <span className="truncate capitalize">{(item.label ?? 'Unknown').replaceAll('_', ' ')}</span>
                            <strong>{item.total}</strong>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${(Number(item.total) / maximum) * 100}%` }} />
                        </div>
                    </div>
                ))}
                {!items.length && <p className="text-muted-foreground text-sm">No data yet.</p>}
            </CardContent>
        </Card>
    );
}
