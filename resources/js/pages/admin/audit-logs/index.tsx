import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ScrollText, Search, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface AuditLog {
    id: number;
    actor_name: string;
    actor_email: string;
    action: string;
    method: string;
    route_name: string | null;
    path: string;
    ip_address: string | null;
    metadata: { changed_fields?: string[]; route_parameters?: Record<string, unknown>; response_status?: number } | null;
    created_at: string;
}

interface PaginatedLogs {
    data: AuditLog[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Audit Logs', href: '/admin/audit-logs' },
];

export default function AuditLogIndex({ filters, logs }: { filters: { search: string }; logs: PaginatedLogs }) {
    const [search, setSearch] = useState(filters.search);

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        router.get('/admin/audit-logs', search.trim() ? { search: search.trim() } : {}, { preserveState: true, replace: true });
    }

    function clearSearch(): void {
        setSearch('');
        router.get('/admin/audit-logs', {}, { preserveState: true, replace: true });
    }

    return (
        <AdminLayout title="Audit Logs" breadcrumbs={breadcrumbs}>
            <Head title="Audit Logs" />
            <Card className="overflow-hidden border-emerald-950/10 shadow-sm">
                <CardHeader className="gap-4 border-b border-emerald-950/10 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <ScrollText className="size-5 text-emerald-700" />
                            Audit Logs
                        </CardTitle>
                        <CardDescription>Authenticated changes, sign-ins, and sign-outs recorded by the system.</CardDescription>
                    </div>
                    <Badge variant="secondary">{logs.total} events</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <form onSubmit={submit} className="flex gap-2 border-b border-emerald-950/10 p-4">
                        <div className="relative max-w-lg flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search user, action, email, or path"
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                            Search
                        </Button>
                        {filters.search && (
                            <Button type="button" variant="outline" onClick={clearSearch}>
                                <X />
                                Clear
                            </Button>
                        )}
                    </form>

                    {logs.data.length ? (
                        <div className="divide-y divide-emerald-950/10">
                            {logs.data.map((log) => (
                                <article
                                    key={log.id}
                                    className="grid gap-3 p-4 hover:bg-emerald-50/30 sm:grid-cols-[minmax(12rem,1fr)_minmax(14rem,1.5fr)_auto] sm:items-center sm:px-6 dark:hover:bg-emerald-950/10"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{log.actor_name}</p>
                                        <p className="text-muted-foreground truncate text-xs">{log.actor_email}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className="capitalize">
                                                {log.action.replace('_', ' ')}
                                            </Badge>
                                            <code className="text-muted-foreground truncate text-xs">
                                                {log.method} /{log.path}
                                            </code>
                                        </div>
                                        {Boolean(log.metadata?.changed_fields?.length) && (
                                            <p className="text-muted-foreground mt-1 truncate text-xs">
                                                Fields: {log.metadata?.changed_fields?.join(', ')}
                                            </p>
                                        )}
                                        <p className="text-muted-foreground mt-1 text-xs">IP: {log.ip_address || 'Unavailable'}</p>
                                    </div>
                                    <time className="text-muted-foreground text-xs whitespace-nowrap" dateTime={log.created_at}>
                                        {new Date(log.created_at).toLocaleString('en-PH')}
                                    </time>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <p className="font-medium">No audit logs found</p>
                            <p className="text-muted-foreground text-sm">Activity will appear here after authenticated changes.</p>
                        </div>
                    )}

                    {logs.last_page > 1 && (
                        <div className="flex items-center justify-between gap-3 border-t border-emerald-950/10 px-5 py-3 text-sm">
                            <span className="text-muted-foreground">
                                Page {logs.current_page} of {logs.last_page}
                            </span>
                            <div className="flex gap-2">
                                {logs.prev_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={logs.prev_page_url}>Previous</Link>
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" disabled>
                                        Previous
                                    </Button>
                                )}
                                {logs.next_page_url ? (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={logs.next_page_url}>Next</Link>
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" disabled>
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
