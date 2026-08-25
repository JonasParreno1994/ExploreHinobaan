import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { DataTable, type DataTableColumn } from '@/components/admin/data-table';
import { EmptyState } from '@/components/admin/empty-state';
import { FilterSelect } from '@/components/admin/filter-select';
import { PageHeader } from '@/components/admin/page-header';
import { Pagination, type LaravelPaginator } from '@/components/admin/pagination';
import { SearchInput } from '@/components/admin/search-input';
import { StatusBadge } from '@/components/admin/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Archive, CalendarDays, Eye, Pencil, Plus, Send, Star, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

interface NamedOption {
    id: number;
    name: string;
}

export interface TourismEvent {
    id: number;
    barangay_id: number | null;
    title: string;
    slug: string;
    event_type: string;
    short_description: string | null;
    description: string | null;
    venue: string;
    start_date: string | null;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    featured_image: string | null;
    featured_image_url: string | null;
    registration_link: string | null;
    organizer: string | null;
    contact_number: string | null;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    created_by: number | null;
    schedule_status: 'schedule_pending' | 'upcoming' | 'ongoing' | 'past';
    barangay: NamedOption | null;
    creator?: NamedOption | null;
}

interface EventPaginator extends LaravelPaginator {
    data: TourismEvent[];
    total: number;
}

interface Filters {
    search: string;
    event_type: string;
    barangay: string;
    date: string;
    status: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events & Festivals', href: '/admin/events' },
];

const scheduleLabels = { schedule_pending: 'Schedule pending', upcoming: 'Upcoming', ongoing: 'Ongoing', past: 'Past' };
const scheduleClasses = {
    schedule_pending: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
    upcoming: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
    ongoing: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    past: 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
};

export default function EventIndex({
    events,
    barangays,
    eventTypes,
    filters,
}: {
    events: EventPaginator;
    barangays: NamedOption[];
    eventTypes: string[];
    filters: Filters;
}) {
    const [search, setSearch] = useState(filters.search);
    const [eventType, setEventType] = useState(filters.event_type || 'all');
    const [barangay, setBarangay] = useState(filters.barangay || 'all');
    const [date, setDate] = useState(filters.date || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [deleting, setDeleting] = useState<TourismEvent | null>(null);

    const visit = useCallback(
        (next: Partial<{ search: string; event_type: string; barangay: string; date: string; status: string }>) => {
            const values = { search, event_type: eventType, barangay, date, status, ...next };
            const query = Object.fromEntries(Object.entries(values).filter(([, value]) => value && value !== 'all'));
            router.get('/admin/events', query, { preserveState: true, replace: true });
        },
        [barangay, date, eventType, search, status],
    );

    const columns: DataTableColumn<TourismEvent>[] = [
        {
            header: 'Event',
            cell: (item) => (
                <div className="flex min-w-64 items-center gap-3">
                    {item.featured_image_url ? (
                        <img src={item.featured_image_url} alt="" className="size-14 rounded-lg object-cover" />
                    ) : (
                        <span className="bg-muted flex size-14 items-center justify-center rounded-lg">
                            <CalendarDays className="text-muted-foreground" />
                        </span>
                    )}
                    <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-muted-foreground text-xs">
                            {item.event_type} · {item.venue}
                        </p>
                    </div>
                </div>
            ),
        },
        { header: 'Barangay', cell: (item) => item.barangay?.name ?? 'Municipality-wide' },
        {
            header: 'Schedule',
            cell: (item) => (
                <div className="grid gap-1">
                    <span>
                        {item.start_date ?? 'Date not set'}
                        {item.end_date ? ` – ${item.end_date}` : ''}
                    </span>
                    <Badge variant="outline" className={`w-fit ${scheduleClasses[item.schedule_status]}`}>
                        {scheduleLabels[item.schedule_status]}
                    </Badge>
                </div>
            ),
        },
        {
            header: 'Publishing',
            cell: (item) => (
                <div className="flex flex-wrap gap-1">
                    <StatusBadge status={item.status} />
                    {item.is_featured && (
                        <Badge variant="outline">
                            <Star className="fill-amber-400 text-amber-500" /> Featured
                        </Badge>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Events & Festivals" breadcrumbs={breadcrumbs}>
            <Head title="Events & Festivals" />
            <PageHeader
                title="Events & Festivals"
                description="Manage tourism, cultural, sports, municipal, and community events."
                actions={
                    <Button asChild className="bg-emerald-700">
                        <Link href={route('admin.events.create')}>
                            <Plus />
                            Add event
                        </Link>
                    </Button>
                }
            />
            <Card>
                <CardContent className="grid gap-5 p-5">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSearch={(value) => visit({ search: value ?? search })}
                        onClear={() => {
                            setSearch('');
                            visit({ search: '' });
                        }}
                        placeholder="Search title, venue, or organizer"
                    />
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <FilterSelect
                            value={eventType}
                            onChange={(value) => {
                                setEventType(value);
                                visit({ event_type: value });
                            }}
                            options={[{ value: 'all', label: 'All event types' }, ...eventTypes.map((type) => ({ value: type, label: type }))]}
                        />
                        <FilterSelect
                            value={barangay}
                            onChange={(value) => {
                                setBarangay(value);
                                visit({ barangay: value });
                            }}
                            options={[
                                { value: 'all', label: 'All barangays' },
                                ...barangays.map((item) => ({ value: String(item.id), label: item.name })),
                            ]}
                        />
                        <FilterSelect
                            value={date}
                            onChange={(value) => {
                                setDate(value);
                                visit({ date: value });
                            }}
                            options={[
                                { value: 'all', label: 'All schedules' },
                                { value: 'upcoming', label: 'Upcoming' },
                                { value: 'ongoing', label: 'Ongoing' },
                                { value: 'past', label: 'Past' },
                                { value: 'unscheduled', label: 'Schedule pending' },
                            ]}
                        />
                        <FilterSelect
                            value={status}
                            onChange={(value) => {
                                setStatus(value);
                                visit({ status: value });
                            }}
                            options={[
                                { value: 'all', label: 'All statuses' },
                                { value: 'draft', label: 'Draft' },
                                { value: 'published', label: 'Published' },
                                { value: 'archived', label: 'Archived' },
                            ]}
                        />
                    </div>
                </CardContent>
                <DataTable
                    columns={columns}
                    rows={events.data}
                    emptyState={<EmptyState icon={CalendarDays} title="No events found" description="Add an event or adjust the current filters." />}
                    actions={(item) => (
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild title="View">
                                <Link href={route('admin.events.show', item.id)}>
                                    <Eye />
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild title="Edit">
                                <Link href={route('admin.events.edit', item.id)}>
                                    <Pencil />
                                </Link>
                            </Button>
                            {item.status !== 'published' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Publish"
                                    onClick={() => router.patch(route('admin.events.publish', item.id))}
                                >
                                    <Send />
                                </Button>
                            )}
                            {item.status !== 'archived' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Archive"
                                    onClick={() => router.patch(route('admin.events.archive', item.id))}
                                >
                                    <Archive />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                title={item.is_featured ? 'Remove from featured' : 'Feature'}
                                onClick={() => router.patch(route('admin.events.toggle-featured', item.id))}
                            >
                                <Star className={item.is_featured ? 'fill-amber-400 text-amber-500' : ''} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600" title="Delete" onClick={() => setDeleting(item)}>
                                <Trash2 />
                            </Button>
                        </div>
                    )}
                />
                <Pagination
                    currentPage={events.current_page}
                    lastPage={events.last_page}
                    previousUrl={events.prev_page_url}
                    nextUrl={events.next_page_url}
                />
            </Card>
            <ConfirmDialog
                open={!!deleting}
                onOpenChange={(open) => !open && setDeleting(null)}
                title="Delete event?"
                description={`${deleting?.title ?? 'This event'} and its image will be permanently deleted.`}
                confirmLabel="Delete event"
                onConfirm={() => deleting && router.delete(route('admin.events.destroy', deleting.id), { onFinish: () => setDeleting(null) })}
            />
        </AdminLayout>
    );
}
