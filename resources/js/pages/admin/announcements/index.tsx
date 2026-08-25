import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface Announcement {
    id: number;
    title: string;
    slug: string;
    content: string;
    publish_date: string;
    expiration_date: string | null;
    status: 'active' | 'inactive';
}

interface AnnouncementPaginator {
    data: Announcement[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

export default function AnnouncementIndex({ announcements }: { announcements: AnnouncementPaginator }) {
    const [selected, setSelected] = useState<Announcement | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Announcements', href: '/admin/announcements' },
    ];

    function remove(): void {
        if (selected) router.delete(route('admin.announcements.destroy', selected.id), { onFinish: () => setSelected(null) });
    }

    return (
        <AdminLayout title="Announcements" breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />
            <Card>
                <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="text-emerald-700" />
                            Announcements
                        </CardTitle>
                        <CardDescription>Manage scheduled and expiring public announcements.</CardDescription>
                    </div>
                    <Button asChild className="bg-emerald-700">
                        <Link href={route('admin.announcements.create')}>
                            <Plus />
                            Add announcement
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {announcements.data.length ? (
                        <div className="divide-y">
                            {announcements.data.map((announcement) => (
                                <article key={announcement.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                                    <div className="grid gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">{announcement.title}</h3>
                                            <StatusBadge status={announcement.status} />
                                        </div>
                                        <p className="text-muted-foreground line-clamp-2 text-sm">{announcement.content}</p>
                                        <p className="text-muted-foreground text-xs">
                                            Publish: {announcement.publish_date} · Expires: {announcement.expiration_date ?? 'No expiration'} · /
                                            {announcement.slug}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.announcements.show', announcement.id)}>
                                                <Eye />
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.announcements.edit', announcement.id)}>
                                                <Pencil />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600" onClick={() => setSelected(announcement)}>
                                            <Trash2 />
                                            Delete
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground py-16 text-center">No announcements yet.</div>
                    )}
                    <Pagination
                        currentPage={announcements.current_page}
                        lastPage={announcements.last_page}
                        previousUrl={announcements.prev_page_url}
                        nextUrl={announcements.next_page_url}
                    />
                </CardContent>
            </Card>
            <ConfirmDialog
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
                title="Delete announcement?"
                description={`${selected?.title ?? 'This announcement'} will be permanently deleted.`}
                confirmLabel="Delete announcement"
                onConfirm={remove}
            />
        </AdminLayout>
    );
}
