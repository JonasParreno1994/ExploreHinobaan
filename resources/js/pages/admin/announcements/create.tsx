import { AnnouncementForm, type AnnouncementFormData } from '@/components/admin/announcement-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

export default function CreateAnnouncement() {
    const form = useForm<AnnouncementFormData>({ title: '', content: '', publish_date: '', expiration_date: '', status: 'active' });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Announcements', href: '/admin/announcements' },
        { title: 'Create', href: '/admin/announcements/create' },
    ];

    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('admin.announcements.store'));
    }

    return (
        <AdminLayout title="Create Announcement" breadcrumbs={breadcrumbs}>
            <Head title="Create Announcement" />
            <Card className="mx-auto w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Create announcement</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <AnnouncementForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.announcements.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700">
                                Create announcement
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
