import { DestinationForm, type DestinationFormData, type DestinationOption } from '@/components/admin/destination-form';
import { LoadingButton } from '@/components/admin/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Destinations', href: '/admin/destinations' },
    { title: 'Create', href: '/admin/destinations/create' },
];

export default function CreateDestination({ categories, barangays }: { categories: DestinationOption[]; barangays: DestinationOption[] }) {
    const form = useForm<DestinationFormData>({
        category_id: '',
        barangay_id: '',
        name: '',
        short_description: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        entrance_fee: '',
        opening_time: '',
        closing_time: '',
        contact_number: '',
        email: '',
        website: '',
        featured_image: null,
        gallery_images: [],
        status: 'draft',
        is_featured: false,
    });
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('admin.destinations.store'), { forceFormData: true });
    }

    return (
        <AdminLayout title="Add Destination" breadcrumbs={breadcrumbs}>
            <Head title="Add Destination" />
            <Card className="mx-auto w-full max-w-6xl">
                <CardHeader>
                    <CardTitle>Add tourism destination</CardTitle>
                </CardHeader>
                <CardContent>
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
                                <Link href={route('admin.destinations.index')}>Cancel</Link>
                            </Button>
                            <LoadingButton type="submit" loading={form.processing} loadingLabel="Creating…" className="bg-emerald-700">
                                Create destination
                            </LoadingButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
