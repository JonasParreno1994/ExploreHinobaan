import { AnnouncementForm, type AnnouncementFormData } from '@/components/admin/announcement-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type Announcement } from './index';

export default function EditAnnouncement({ announcement }: { announcement: Announcement }) {
    const form = useForm<AnnouncementFormData>({
        title: announcement.title,
        content: announcement.content,
        publish_date: announcement.publish_date,
        expiration_date: announcement.expiration_date ?? '',
        status: announcement.status,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Announcements', href: '/admin/announcements' },
        { title: 'Edit', href: `/admin/announcements/${announcement.id}/edit` },
    ];

    function submit(event: FormEvent): void {
        event.preventDefault();
        form.put(route('admin.announcements.update', announcement.id));
    }

    return (
        <AdminLayout title="Edit Announcement" breadcrumbs={breadcrumbs}>
            <Head title="Edit Announcement" />
            <Card className="mx-auto w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Edit announcement</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <AnnouncementForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.announcements.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700">
                                Save changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
