import { EventForm, type EventFormData } from '@/components/admin/event-form';
import { LoadingButton } from '@/components/admin/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

interface BarangayOption {
    id: number;
    name: string;
    status: string;
}

export default function CreateEvent({ barangays, eventTypes }: { barangays: BarangayOption[]; eventTypes: string[] }) {
    const form = useForm<EventFormData>({
        barangay_id: '',
        title: '',
        event_type: '',
        short_description: '',
        description: '',
        venue: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        featured_image: null,
        registration_link: '',
        organizer: '',
        contact_number: '',
        status: 'draft',
        is_featured: false,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Events & Festivals', href: '/admin/events' },
        { title: 'Create', href: '/admin/events/create' },
    ];
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('admin.events.store'), { forceFormData: true });
    }
    return (
        <AdminLayout title="Create Event" breadcrumbs={breadcrumbs}>
            <Head title="Create Event" />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Create event or festival</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <EventForm data={form.data} errors={form.errors} barangays={barangays} eventTypes={eventTypes} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.events.index')}>Cancel</Link>
                            </Button>
                            <LoadingButton loading={form.processing}>Create event</LoadingButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
