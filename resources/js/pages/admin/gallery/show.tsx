import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { type Gallery } from './index';

export default function ShowGallery({ gallery }: { gallery: Gallery }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gallery', href: '/admin/gallery' },
        { title: `Gallery #${gallery.id}`, href: `/admin/gallery/${gallery.id}` },
    ];

    return (
        <AdminLayout title="Gallery Details" breadcrumbs={breadcrumbs}>
            <Head title={`Gallery #${gallery.id}`} />
            <Card className="mx-auto w-full max-w-6xl">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Gallery #{gallery.id}</CardTitle>
                    <Button asChild>
                        <Link href={route('admin.gallery.edit', gallery.id)}>Edit</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {gallery.image_urls.map((url, index) => (
                            <img key={url} src={url} alt={`Gallery picture ${index + 1}`} className="aspect-square w-full rounded-xl object-cover" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
