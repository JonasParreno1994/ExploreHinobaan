import { DestinationForm, type DestinationFormData, type DestinationOption } from '@/components/admin/destination-form';
import { DestinationGalleryManager } from '@/components/admin/destination-gallery-manager';
import { LoadingButton } from '@/components/admin/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type Destination } from './index';

export default function EditDestination({
    destination,
    categories,
    barangays,
}: {
    destination: Destination;
    categories: DestinationOption[];
    barangays: DestinationOption[];
}) {
    const form = useForm<DestinationFormData>({
        category_id: String(destination.category_id),
        barangay_id: String(destination.barangay_id),
        name: destination.name,
        short_description: destination.short_description ?? '',
        description: destination.description ?? '',
        address: destination.address,
        latitude: destination.latitude ?? '',
        longitude: destination.longitude ?? '',
        entrance_fee: destination.entrance_fee ?? '',
        opening_time: destination.opening_time?.slice(0, 5) ?? '',
        closing_time: destination.closing_time?.slice(0, 5) ?? '',
        contact_number: destination.contact_number ?? '',
        email: destination.email ?? '',
        website: destination.website ?? '',
        featured_image: null,
        gallery_images: [],
        status: destination.status,
        is_featured: destination.is_featured,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Destinations', href: '/admin/destinations' },
        { title: 'Edit', href: `/admin/destinations/${destination.id}/edit` },
    ];
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.destinations.update', destination.id), { forceFormData: true });
    }

    return (
        <AdminLayout title="Edit Destination" breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${destination.name}`} />
            <div className="mx-auto grid w-full max-w-6xl gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit {destination.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {destination.featured_image_url && (
                            <div>
                                <p className="mb-2 text-sm font-medium">Current featured image</p>
                                <img
                                    src={destination.featured_image_url}
                                    alt={destination.name}
                                    className="aspect-video max-h-72 w-full rounded-xl object-cover"
                                />
                            </div>
                        )}
                        <form onSubmit={submit} className="grid gap-6">
                            <DestinationForm
                                data={form.data}
                                errors={form.errors}
                                categories={categories}
                                barangays={barangays}
                                onChange={form.setData}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.destinations.show', destination.id)}>Cancel</Link>
                                </Button>
                                <LoadingButton type="submit" loading={form.processing} loadingLabel="Saving…" className="bg-emerald-700">
                                    Save changes
                                </LoadingButton>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <DestinationGalleryManager destinationId={destination.id} initialImages={destination.images ?? []} />
            </div>
        </AdminLayout>
    );
}
