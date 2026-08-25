import { GalleryForm, type GalleryFormData } from '@/components/admin/gallery-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

export default function CreateGallery() {
    const form = useForm<GalleryFormData>({ images: [], status: 'active' });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gallery', href: '/admin/gallery' },
        { title: 'Add Pictures', href: '/admin/gallery/create' },
    ];

    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('admin.gallery.store'), { forceFormData: true });
    }

    return (
        <AdminLayout title="Add Gallery Pictures" breadcrumbs={breadcrumbs}>
            <Head title="Add Gallery Pictures" />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Add gallery pictures</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <GalleryForm data={form.data} errors={form.errors} onChange={form.setData} imagesRequired />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.gallery.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700">
                                Add pictures
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
