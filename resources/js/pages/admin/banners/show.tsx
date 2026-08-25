import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { type Banner } from './index';
export default function ShowBanner({ banner }: { banner: Banner }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Banners', href: '/admin/banners' },
        { title: `Banner #${banner.id}`, href: `/admin/banners/${banner.id}` },
    ];
    return (
        <AdminLayout title="Banner Details" breadcrumbs={breadcrumbs}>
            <Head title={`Banner #${banner.id}`} />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader className="flex-row justify-between">
                    <CardTitle>Banner #{banner.id}</CardTitle>
                    <Button asChild>
                        <Link href={route('admin.banners.edit', banner.id)}>Edit</Link>
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <section>
                        <h3 className="mb-3 font-semibold">Pictures</h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {banner.image_urls.map((url, i) => (
                                <img key={url} src={url} alt={`Banner picture ${i + 1}`} className="aspect-video w-full rounded-xl object-cover" />
                            ))}
                        </div>
                    </section>
                    <section className="grid gap-3 rounded-xl border p-5">
                        <h3 className="font-semibold">Carousel overlay text</h3>
                        <p className="bg-muted rounded-lg p-3 text-sm">
                            <strong>Header 1:</strong> {banner.text_content?.header_1 || 'Not set'}
                        </p>
                        <p className="bg-muted rounded-lg p-3 text-sm">
                            <strong>Header 2:</strong> {banner.text_content?.header_2 || 'Not set'}
                        </p>
                        <p className="bg-muted rounded-lg p-3 text-sm">
                            <strong>Header 3:</strong> {banner.text_content?.header_3 || 'Not set'}
                        </p>
                    </section>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
