import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Archive, Eye, MapPin, Pencil, Star } from 'lucide-react';
import { useState } from 'react';
import { type Destination } from './index';

type DestinationAction = 'publish' | 'unpublish' | 'archive' | 'toggle-featured';

export default function ShowDestination({ destination }: { destination: Destination }) {
    const [action, setAction] = useState<DestinationAction | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Destinations', href: '/admin/destinations' },
        { title: destination.name, href: `/admin/destinations/${destination.id}` },
    ];
    const actionLabels: Record<DestinationAction, string> = {
        publish: 'Publish',
        unpublish: 'Return to draft',
        archive: 'Archive',
        'toggle-featured': destination.is_featured ? 'Remove featured' : 'Feature destination',
    };
    function confirmAction(): void {
        if (!action) return;
        router.patch(route(`admin.destinations.${action}`, destination.id), {}, { preserveScroll: true, onFinish: () => setAction(null) });
    }

    return (
        <AdminLayout title="Destination Details" breadcrumbs={breadcrumbs}>
            <Head title={destination.name} />
            <div className="mx-auto grid w-full max-w-6xl gap-6">
                <Card className="overflow-hidden">
                    {destination.featured_image_url && (
                        <img src={destination.featured_image_url} alt={destination.name} className="aspect-[21/8] max-h-96 w-full object-cover" />
                    )}
                    <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="grid gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="text-2xl">{destination.name}</CardTitle>
                                <StatusBadge status={destination.status} />
                                {destination.is_featured && (
                                    <span className="flex items-center gap-1 text-sm text-amber-600">
                                        <Star className="size-4 fill-current" />
                                        Featured
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                <MapPin className="size-4" />
                                {destination.address}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.destinations.edit', destination.id)}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                            {destination.status !== 'published' && (
                                <Button onClick={() => setAction('publish')} className="bg-emerald-700">
                                    Publish
                                </Button>
                            )}
                            {destination.status === 'published' && (
                                <Button variant="outline" onClick={() => setAction('unpublish')}>
                                    Return to draft
                                </Button>
                            )}
                            {destination.status !== 'archived' && (
                                <Button variant="outline" onClick={() => setAction('archive')}>
                                    <Archive />
                                    Archive
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setAction('toggle-featured')}>
                                <Star />
                                {destination.is_featured ? 'Unfeature' : 'Feature'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <dl className="grid gap-4 rounded-xl border p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <dt className="text-muted-foreground">Category</dt>
                                <dd className="font-medium">{destination.category.name}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Barangay</dt>
                                <dd className="font-medium">{destination.barangay.name}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Entrance fee</dt>
                                <dd className="font-medium">
                                    {destination.entrance_fee
                                        ? `₱${Number(destination.entrance_fee).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
                                        : 'Not set'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Views</dt>
                                <dd className="flex items-center gap-1 font-medium">
                                    <Eye className="size-4" />
                                    {destination.views.toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Opening time</dt>
                                <dd className="font-medium">{destination.opening_time ?? 'Not set'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Closing time</dt>
                                <dd className="font-medium">{destination.closing_time ?? 'Not set'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Coordinates</dt>
                                <dd className="font-medium">
                                    {destination.latitude && destination.longitude
                                        ? `${destination.latitude}, ${destination.longitude}`
                                        : 'Awaiting verification'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Created by</dt>
                                <dd className="font-medium">{destination.creator?.name ?? 'System'}</dd>
                            </div>
                        </dl>
                        {destination.short_description && (
                            <section>
                                <h3 className="mb-2 font-semibold">Summary</h3>
                                <p className="text-muted-foreground leading-7">{destination.short_description}</p>
                            </section>
                        )}
                        {destination.description && (
                            <section>
                                <h3 className="mb-2 font-semibold">Description</h3>
                                <div className="text-muted-foreground leading-7 whitespace-pre-wrap">{destination.description}</div>
                            </section>
                        )}
                        <section>
                            <h3 className="mb-3 font-semibold">Contact information</h3>
                            <div className="grid gap-2 text-sm">
                                <p>Phone: {destination.contact_number ?? 'Not set'}</p>
                                <p>Email: {destination.email ?? 'Not set'}</p>
                                <p>
                                    Website:{' '}
                                    {destination.website ? (
                                        <a href={destination.website} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                                            {destination.website}
                                        </a>
                                    ) : (
                                        'Not set'
                                    )}
                                </p>
                            </div>
                        </section>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Destination gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {destination.images?.length ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {destination.images.map((image, index) => (
                                    <img
                                        key={image.id}
                                        src={image.image_url}
                                        alt={image.caption ?? `${destination.name} gallery ${index + 1}`}
                                        className="aspect-video w-full rounded-xl object-cover"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground py-8 text-center text-sm">No gallery images uploaded.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <ConfirmDialog
                open={action !== null}
                onOpenChange={(open) => !open && setAction(null)}
                title={`${action ? actionLabels[action] : 'Update'}?`}
                description="This will update the destination's public visibility settings without deleting its information."
                confirmLabel={action ? actionLabels[action] : 'Confirm'}
                onConfirm={confirmAction}
            />
        </AdminLayout>
    );
}
