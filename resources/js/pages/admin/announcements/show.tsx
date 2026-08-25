import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { type Announcement } from './index';

export default function ShowAnnouncement({ announcement }: { announcement: Announcement }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Announcements', href: '/admin/announcements' },
        { title: announcement.title, href: `/admin/announcements/${announcement.id}` },
    ];

    return (
        <AdminLayout title="Announcement Details" breadcrumbs={breadcrumbs}>
            <Head title={announcement.title} />
            <Card className="mx-auto w-full max-w-4xl">
                <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="grid gap-2">
                        <CardTitle>{announcement.title}</CardTitle>
                        <div>
                            <StatusBadge status={announcement.status} />
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.announcements.edit', announcement.id)}>Edit</Link>
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <dl className="grid gap-4 rounded-xl border p-5 text-sm sm:grid-cols-3">
                        <div>
                            <dt className="text-muted-foreground">Slug</dt>
                            <dd className="font-medium">{announcement.slug}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Publish date</dt>
                            <dd className="font-medium">{announcement.publish_date}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Expiration date</dt>
                            <dd className="font-medium">{announcement.expiration_date ?? 'No expiration'}</dd>
                        </div>
                    </dl>
                    <section>
                        <h3 className="mb-3 font-semibold">Content</h3>
                        <div className="text-muted-foreground leading-7 whitespace-pre-wrap">{announcement.content}</div>
                    </section>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
