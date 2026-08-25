import { EventForm, type EventFormData } from '@/components/admin/event-form';
import { LoadingButton } from '@/components/admin/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type TourismEvent } from './index';

interface BarangayOption {
    id: number;
    name: string;
    status: string;
}

export default function EditEvent({ event, barangays, eventTypes }: { event: TourismEvent; barangays: BarangayOption[]; eventTypes: string[] }) {
    const form = useForm<EventFormData>({
        barangay_id: event.barangay_id ? String(event.barangay_id) : '',
        title: event.title,
        event_type: event.event_type,
        short_description: event.short_description ?? '',
        description: event.description ?? '',
        venue: event.venue,
        start_date: event.start_date ?? '',
        end_date: event.end_date ?? '',
        start_time: event.start_time?.slice(0, 5) ?? '',
        end_time: event.end_time?.slice(0, 5) ?? '',
        featured_image: null,
        registration_link: event.registration_link ?? '',
        organizer: event.organizer ?? '',
        contact_number: event.contact_number ?? '',
        status: event.status,
        is_featured: event.is_featured,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Events & Festivals', href: '/admin/events' },
        { title: 'Edit', href: `/admin/events/${event.id}/edit` },
    ];
    function submit(submitEvent: FormEvent): void {
        submitEvent.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.events.update', event.id), { forceFormData: true });
    }
    return (
        <AdminLayout title="Edit Event" breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${event.title}`} />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Edit event or festival</CardTitle>
                </CardHeader>
                <CardContent>
                    {event.featured_image_url && (
                        <div className="mb-6 grid gap-2">
                            <p className="text-sm font-medium">Current featured image</p>
                            <img src={event.featured_image_url} alt={event.title} className="h-48 w-full rounded-xl object-cover sm:w-80" />
                        </div>
                    )}
                    <form onSubmit={submit} className="grid gap-6">
                        <EventForm data={form.data} errors={form.errors} barangays={barangays} eventTypes={eventTypes} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.events.show', event.id)}>Cancel</Link>
                            </Button>
                            <LoadingButton loading={form.processing}>Save changes</LoadingButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
