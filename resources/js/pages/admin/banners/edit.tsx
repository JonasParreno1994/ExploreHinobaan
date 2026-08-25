import { BannerForm, type BannerFormData } from '@/components/admin/banner-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type Banner } from './index';
export default function EditBanner({ banner }: { banner: Banner }) {
    const form = useForm<BannerFormData>({
        images: [],
        status: banner.status,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Banners', href: '/admin/banners' },
        { title: 'Edit', href: `/admin/banners/${banner.id}/edit` },
    ];
    function submit(e: FormEvent): void {
        e.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.banners.update', banner.id), { forceFormData: true });
    }
    return (
        <AdminLayout title="Edit Banner" breadcrumbs={breadcrumbs}>
            <Head title="Edit Banner" />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Edit banner</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {banner.image_urls.map((url, i) => (
                            <img key={url} src={url} alt={`Existing ${i + 1}`} className="aspect-video w-full rounded-lg object-cover" />
                        ))}
                    </div>
                    <form onSubmit={submit} className="grid gap-6">
                        <BannerForm data={form.data} errors={form.errors} onChange={form.setData} imagesRequired={false} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.banners.index')}>Cancel</Link>
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
