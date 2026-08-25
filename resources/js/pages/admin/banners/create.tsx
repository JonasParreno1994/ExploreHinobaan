import { BannerForm, type BannerFormData } from '@/components/admin/banner-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
export default function CreateBanner() {
    const form = useForm<BannerFormData>({ images: [], status: 'active' });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Banners', href: '/admin/banners' },
        { title: 'Create', href: '/admin/banners/create' },
    ];
    function submit(e: FormEvent): void {
        e.preventDefault();
        form.post(route('admin.banners.store'), { forceFormData: true });
    }
    return (
        <AdminLayout title="Add Pictures" breadcrumbs={breadcrumbs}>
            <Head title="Add Pictures" />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Add banner pictures</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <BannerForm data={form.data} errors={form.errors} onChange={form.setData} imagesRequired />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.banners.index')}>Cancel</Link>
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
