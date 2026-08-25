import { StatusBadge } from '@/components/admin/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, ExternalLink, MapPin, Pencil, Star } from 'lucide-react';
import { type TourismEvent } from './index';

const scheduleLabels = { schedule_pending: 'Schedule pending', upcoming: 'Upcoming', ongoing: 'Ongoing', past: 'Past' };

export default function ShowEvent({ event }: { event: TourismEvent }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Events & Festivals', href: '/admin/events' },
        { title: event.title, href: `/admin/events/${event.id}` },
    ];
    return (
        <AdminLayout title="Event Details" breadcrumbs={breadcrumbs}>
            <Head title={event.title} />
            <Card className="mx-auto w-full max-w-5xl overflow-hidden">
                {event.featured_image_url && <img src={event.featured_image_url} alt={event.title} className="max-h-96 w-full object-cover" />}
                <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="grid gap-3">
                        <CardTitle className="text-2xl">{event.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <StatusBadge status={event.status} />
                            <Badge variant="outline">{event.event_type}</Badge>
                            <Badge variant="outline">{scheduleLabels[event.schedule_status]}</Badge>
                            {event.is_featured && (
                                <Badge variant="outline">
                                    <Star className="fill-amber-400 text-amber-500" />
                                    Featured
                                </Badge>
                            )}
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.events.edit', event.id)}>
                            <Pencil />
                            Edit
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-4 rounded-xl border p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-muted-foreground">Venue</p>
                            <p className="flex gap-1 font-medium">
                                <MapPin className="size-4" />
                                {event.venue}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Barangay</p>
                            <p className="font-medium">{event.barangay?.name ?? 'Municipality-wide'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="flex gap-1 font-medium">
                                <CalendarDays className="size-4" />
                                {event.start_date ?? 'Schedule pending'}
                                {event.end_date ? ` – ${event.end_date}` : ''}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="font-medium">
                                {event.start_time?.slice(0, 5) ?? 'Not set'}
                                {event.end_time ? ` – ${event.end_time.slice(0, 5)}` : ''}
                            </p>
                        </div>
                    </div>
                    {event.short_description && <p className="text-muted-foreground text-lg">{event.short_description}</p>}
                    {event.description && (
                        <section>
                            <h3 className="mb-3 font-semibold">Description</h3>
                            <div className="text-muted-foreground leading-7 whitespace-pre-wrap">{event.description}</div>
                        </section>
                    )}
                    <section className="grid gap-4 rounded-xl border p-5 text-sm sm:grid-cols-3">
                        <div>
                            <p className="text-muted-foreground">Organizer</p>
                            <p className="font-medium">{event.organizer ?? 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Contact number</p>
                            <p className="font-medium">{event.contact_number ?? 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created by</p>
                            <p className="font-medium">{event.creator?.name ?? 'System'}</p>
                        </div>
                    </section>
                    {event.registration_link && (
                        <Button variant="outline" asChild className="w-fit">
                            <a href={event.registration_link} target="_blank" rel="noreferrer">
                                <ExternalLink />
                                Open registration page
                            </a>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
