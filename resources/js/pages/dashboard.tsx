import { StatCard } from '@/components/admin/stat-card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Building2,
    CalendarDays,
    ClipboardCheck,
    FileCheck2,
    MapPin,
    Megaphone,
    ShieldAlert,
    ShieldCheck,
    Star,
    TrendingDown,
    TrendingUp,
    UserRoundCheck,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];
const periods = [
    ['today', 'Today'],
    ['week', 'This week'],
    ['month', 'This month'],
    ['year', 'This year'],
] as const;

interface DashboardProps {
    period: string;
    dateRange: { start: string; end: string; label: string };
    statistics: {
        total_visitors: number;
        domestic: number;
        foreign: number;
        adults: number;
        children: number;
        day_visitors: number;
        overnight: number;
        active_enterprises: number;
        visitor_change: number | null;
    };
    attention: Record<string, { count: number; href: string }>;
    arrivalTrend: { label: string; value: number }[];
    topEnterprises: {
        id: number;
        business_name: string;
        visitor_count: number | null;
        enterprise_type: { name: string } | null;
        barangay: { name: string } | null;
    }[];
    topDestinations: { id: number; name: string; slug: string; views: number }[];
    upcomingEvents: { id: number; title: string; start_date: string; venue: string; barangay: { name: string } | null }[];
    recentActivity: { id: number; actor_name: string; action: string; path: string; created_at: string }[];
    isAdministrator: boolean;
}

const attentionDetails = {
    enterprise_applications: ['Enterprise applications', Building2, 'text-orange-700', 'bg-orange-50'],
    enterprise_documents: ['Enterprise documents', FileCheck2, 'text-sky-700', 'bg-sky-50'],
    tourist_verifications: ['Tourist verifications', UserRoundCheck, 'text-violet-700', 'bg-violet-50'],
    daily_reports: ['Daily reports', ClipboardCheck, 'text-teal-700', 'bg-teal-50'],
    reviews: ['Reviews to moderate', Star, 'text-amber-700', 'bg-amber-50'],
    security_incidents: ['Security incidents', ShieldAlert, 'text-red-700', 'bg-red-50'],
} as const;

export default function Dashboard({
    period,
    dateRange,
    statistics,
    attention,
    arrivalTrend,
    topEnterprises,
    topDestinations,
    upcomingEvents,
    recentActivity,
    isAdministrator,
}: DashboardProps) {
    const chartMaximum = Math.max(...arrivalTrend.map((item) => item.value), 1);
    const totalVisitorTypes = statistics.domestic + statistics.foreign;
    const formatNumber = (value: number) => new Intl.NumberFormat('en-PH').format(value);

    function selectPeriod(nextPeriod: string): void {
        router.get(route('dashboard'), { period: nextPeriod }, { preserveScroll: true, preserveState: true });
    }

    return (
        <AdminLayout title="Tourism Operations Dashboard" breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="grid gap-6">
                <section className="flex flex-col gap-4 rounded-2xl bg-linear-to-r from-emerald-950 to-teal-800 p-6 text-white shadow-sm sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-[.18em] text-amber-300 uppercase">Explore Hinoba-an</p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Tourism at a glance</h2>
                        <p className="mt-2 text-sm text-emerald-100">
                            {dateRange.label}: {formatDate(dateRange.start)} – {formatDate(dateRange.end)}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2" aria-label="Dashboard reporting period">
                        {periods.map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => selectPeriod(value)}
                                className={`rounded-lg px-3 py-2 text-xs font-bold transition ${period === value ? 'bg-white text-emerald-950 shadow-sm' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                <section
                    className="flex flex-col gap-3 rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:bg-slate-950"
                    aria-labelledby="quick-actions-heading"
                >
                    <div className="sm:mr-auto">
                        <h2 id="quick-actions-heading" className="font-bold text-emerald-950 dark:text-emerald-50">
                            Quick actions
                        </h2>
                        <p className="text-muted-foreground text-xs">Common Tourism Office tasks.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <QuickAction href={route('admin.destinations.create')} label="Add destination" icon={<MapPin className="size-4" />} />
                        <QuickAction href={route('admin.events.create')} label="Create event" icon={<CalendarDays className="size-4" />} />
                        <QuickAction
                            href={route('admin.announcements.create')}
                            label="Publish announcement"
                            icon={<Megaphone className="size-4" />}
                        />
                        <QuickAction href={route('admin.tourist-arrivals.index')} label="View arrivals" icon={<Users className="size-4" />} />
                    </div>
                </section>

                <section aria-labelledby="attention-heading">
                    <div className="mb-3">
                        <h2 id="attention-heading" className="text-lg font-bold text-emerald-950 dark:text-emerald-50">
                            Needs attention
                        </h2>
                        <p className="text-muted-foreground text-sm">Items waiting for Tourism Office action.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {Object.entries(attention).map(([key, item]) => {
                            const [label, Icon, color, background] = attentionDetails[key as keyof typeof attentionDetails];
                            return (
                                <Link
                                    key={key}
                                    href={item.href}
                                    className="group flex items-center gap-4 rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950"
                                >
                                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${background} ${color}`}>
                                        <Icon className="size-5" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <strong className="block text-2xl text-emerald-950 dark:text-emerald-50">{formatNumber(item.count)}</strong>
                                        <span className="text-muted-foreground text-sm">{label}</span>
                                    </span>
                                    <ArrowRight className="text-muted-foreground size-4 transition group-hover:translate-x-1 group-hover:text-orange-600" />
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Tourism statistics">
                    <StatCard
                        title="Tourist arrivals"
                        value={formatNumber(statistics.total_visitors)}
                        description={dateRange.label}
                        icon={<Users className="size-5" />}
                        trend={<VisitorTrend value={statistics.visitor_change} />}
                    />
                    <StatCard
                        title="Domestic visitors"
                        value={formatNumber(statistics.domestic)}
                        description={`${percentage(statistics.domestic, totalVisitorTypes)}% of visitors`}
                        icon={<MapPin className="size-5" />}
                    />
                    <StatCard
                        title="Foreign visitors"
                        value={formatNumber(statistics.foreign)}
                        description={`${percentage(statistics.foreign, totalVisitorTypes)}% of visitors`}
                        icon={<ShieldCheck className="size-5" />}
                    />
                    <StatCard
                        title="Active enterprises"
                        value={formatNumber(statistics.active_enterprises)}
                        description="Approved tourism partners"
                        icon={<Building2 className="size-5" />}
                    />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
                    <DashboardPanel title="Six-month arrival trend" description="Actual guests recorded by tourism enterprises.">
                        <div className="mt-6 flex h-64 items-end gap-3 sm:gap-5">
                            {arrivalTrend.map((item) => (
                                <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100">{formatNumber(item.value)}</span>
                                    <div className="flex h-48 w-full items-end rounded-xl bg-emerald-50 p-1 dark:bg-emerald-950/50">
                                        <div
                                            className="w-full rounded-lg bg-linear-to-t from-emerald-700 to-teal-400 transition-all"
                                            style={{ height: `${Math.max((item.value / chartMaximum) * 100, item.value > 0 ? 6 : 0)}%` }}
                                        />
                                    </div>
                                    <span className="text-muted-foreground text-xs font-semibold">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </DashboardPanel>
                    <DashboardPanel title="Visitor profile" description={`Breakdown for ${dateRange.label.toLowerCase()}.`}>
                        <div className="mt-6 grid gap-6">
                            <Breakdown
                                title="Origin"
                                firstLabel="Domestic"
                                firstValue={statistics.domestic}
                                secondLabel="Foreign"
                                secondValue={statistics.foreign}
                                firstColor="bg-emerald-700"
                                secondColor="bg-orange-500"
                            />
                            <Breakdown
                                title="Visit type"
                                firstLabel="Day visitors"
                                firstValue={statistics.day_visitors}
                                secondLabel="Overnight"
                                secondValue={statistics.overnight}
                                firstColor="bg-sky-600"
                                secondColor="bg-violet-500"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <MiniStat label="Adults" value={statistics.adults} />
                                <MiniStat label="Children" value={statistics.children} />
                            </div>
                        </div>
                    </DashboardPanel>
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <DashboardPanel title="Top tourism enterprises" description={`Ranked by actual visitors for ${dateRange.label.toLowerCase()}.`}>
                        <RankedList
                            empty="No enterprise arrivals recorded for this period."
                            items={topEnterprises.map((enterprise) => ({
                                id: enterprise.id,
                                title: enterprise.business_name,
                                subtitle:
                                    [enterprise.enterprise_type?.name, enterprise.barangay?.name].filter(Boolean).join(' · ') || 'Tourism enterprise',
                                value: `${formatNumber(Number(enterprise.visitor_count ?? 0))} visitors`,
                            }))}
                        />
                    </DashboardPanel>
                    <DashboardPanel title="Popular destinations online" description="Published destinations ranked by page views.">
                        <RankedList
                            empty="No published destination views yet."
                            items={topDestinations.map((destination) => ({
                                id: destination.id,
                                title: destination.name,
                                subtitle: 'Online visitor interest',
                                value: `${formatNumber(destination.views)} views`,
                            }))}
                        />
                    </DashboardPanel>
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <DashboardPanel title="Upcoming events" description="Published events ordered by schedule.">
                        <div className="mt-5 grid gap-3">
                            {upcomingEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={route('admin.events.show', event.id)}
                                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-3 transition hover:border-orange-200 hover:bg-orange-50/50 dark:border-slate-800"
                                >
                                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-700">
                                        <CalendarDays className="size-5" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <strong className="block truncate text-sm">{event.title}</strong>
                                        <span className="text-muted-foreground block truncate text-xs">{event.barangay?.name ?? event.venue}</span>
                                    </span>
                                    <time className="text-right text-xs font-bold text-emerald-800 dark:text-emerald-200">
                                        {formatDate(event.start_date)}
                                    </time>
                                </Link>
                            ))}
                            {upcomingEvents.length === 0 && <EmptyMessage text="No upcoming published events." />}
                        </div>
                    </DashboardPanel>
                    <DashboardPanel title="Recent administrative activity" description="Latest recorded changes across the portal.">
                        <div className="mt-5 grid gap-3">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
                                >
                                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950">
                                        <Activity className="size-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <strong className="block truncate text-sm">{humanize(activity.action)}</strong>
                                        <span className="text-muted-foreground block truncate text-xs">
                                            {activity.actor_name} · {activity.path}
                                        </span>
                                    </span>
                                    <time className="text-muted-foreground shrink-0 text-xs">{formatShortDate(activity.created_at)}</time>
                                </div>
                            ))}
                            {recentActivity.length === 0 && <EmptyMessage text="No administrative activity recorded yet." />}
                        </div>
                        {isAdministrator && (
                            <Link
                                href={route('admin.audit-logs.index')}
                                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-orange-600"
                            >
                                View complete audit log <ArrowRight className="size-4" />
                            </Link>
                        )}
                    </DashboardPanel>
                </section>
            </div>
        </AdminLayout>
    );
}

function DashboardPanel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm sm:p-6 dark:bg-slate-950">
            <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">{title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
            {children}
        </div>
    );
}

function QuickAction({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/15 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:text-emerald-200"
        >
            {icon}
            {label}
        </Link>
    );
}

function VisitorTrend({ value }: { value: number | null }) {
    if (value === null) return <span className="text-muted-foreground">No previous-period comparison</span>;
    const TrendIcon = value >= 0 ? TrendingUp : TrendingDown;
    return (
        <span className={`inline-flex items-center gap-1 font-semibold ${value >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            <TrendIcon className="size-3.5" /> {Math.abs(value)}% from previous period
        </span>
    );
}

function Breakdown({
    title,
    firstLabel,
    firstValue,
    secondLabel,
    secondValue,
    firstColor,
    secondColor,
}: {
    title: string;
    firstLabel: string;
    firstValue: number;
    secondLabel: string;
    secondValue: number;
    firstColor: string;
    secondColor: string;
}) {
    const total = firstValue + secondValue;
    const firstWidth = percentage(firstValue, total);
    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <strong>{title}</strong>
                <span className="text-muted-foreground">{new Intl.NumberFormat('en-PH').format(total)} recorded</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <span className={firstColor} style={{ width: `${firstWidth}%` }} />
                <span className={secondColor} style={{ width: `${total > 0 ? 100 - firstWidth : 0}%` }} />
            </div>
            <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                <span>
                    {firstLabel}: {firstValue}
                </span>
                <span>
                    {secondLabel}: {secondValue}
                </span>
            </div>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
            <strong className="block text-xl text-emerald-900 dark:text-emerald-100">{new Intl.NumberFormat('en-PH').format(value)}</strong>
            <span className="text-muted-foreground text-xs">{label}</span>
        </div>
    );
}

function RankedList({ items, empty }: { items: { id: number; title: string; subtitle: string; value: string }[]; empty: string }) {
    return (
        <div className="mt-5 grid gap-2">
            {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-900 text-xs font-bold text-white">
                        {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                        <strong className="block truncate text-sm">{item.title}</strong>
                        <span className="text-muted-foreground block truncate text-xs">{item.subtitle}</span>
                    </span>
                    <span className="shrink-0 text-xs font-bold text-emerald-800 dark:text-emerald-200">{item.value}</span>
                </div>
            ))}
            {items.length === 0 && <EmptyMessage text={empty} />}
        </div>
    );
}

function EmptyMessage({ text }: { text: string }) {
    return <p className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">{text}</p>;
}

function percentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
}
function humanize(value: string): string {
    return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function formatDate(value: string): string {
    return new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(`${value}T00:00:00Z`),
    );
}
function formatShortDate(value: string): string {
    return new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric' }).format(new Date(value));
}
