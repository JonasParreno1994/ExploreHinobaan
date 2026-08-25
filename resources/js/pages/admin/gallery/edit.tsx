import { GalleryForm, type GalleryFormData } from '@/components/admin/gallery-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type Gallery } from './index';

export default function EditGallery({ gallery }: { gallery: Gallery }) {
    const form = useForm<GalleryFormData>({ images: [], status: gallery.status });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gallery', href: '/admin/gallery' },
        { title: 'Edit', href: `/admin/gallery/${gallery.id}/edit` },
    ];

    function submit(event: FormEvent): void {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.gallery.update', gallery.id), { forceFormData: true });
    }

    return (
        <AdminLayout title="Edit Gallery" breadcrumbs={breadcrumbs}>
            <Head title="Edit Gallery" />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Edit gallery</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {gallery.image_urls.map((url, index) => (
                            <img
                                key={url}
                                src={url}
                                alt={`Existing gallery picture ${index + 1}`}
                                className="aspect-square w-full rounded-xl object-cover"
                            />
                        ))}
                    </div>
                    <form onSubmit={submit} className="grid gap-6">
                        <GalleryForm data={form.data} errors={form.errors} onChange={form.setData} imagesRequired={false} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.gallery.index')}>Cancel</Link>
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
