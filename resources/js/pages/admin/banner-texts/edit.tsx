import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type Banner } from '../banners/index';

export default function EditBannerText({ banner }: { banner: Banner }) {
    const form = useForm({
        header_1: banner.text_content?.header_1 ?? '',
        header_2: banner.text_content?.header_2 ?? '',
        header_3: banner.text_content?.header_3 ?? '',
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Text', href: '/admin/text' },
        { title: `Banner #${banner.id}`, href: `/admin/text/${banner.id}/edit` },
    ];

    function submit(event: FormEvent): void {
        event.preventDefault();
        form.put(route('admin.text.update', banner.id));
    }

    return (
        <AdminLayout title="Edit Text" breadcrumbs={breadcrumbs}>
            <Head title="Edit Text" />
            <Card className="mx-auto w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Edit text for Banner #{banner.id}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <img src={banner.image_urls[0]} alt="Banner preview" className="aspect-[16/6] w-full rounded-xl object-cover" />
                        <div className="grid gap-2">
                            <Label htmlFor="header_1">Header 1</Label>
                            <Input id="header_1" value={form.data.header_1} onChange={(event) => form.setData('header_1', event.target.value)} />
                            <InputError message={form.errors.header_1} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="header_2">Header 2</Label>
                            <Input id="header_2" value={form.data.header_2} onChange={(event) => form.setData('header_2', event.target.value)} />
                            <InputError message={form.errors.header_2} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="header_3">Header 3</Label>
                            <textarea
                                id="header_3"
                                rows={5}
                                value={form.data.header_3}
                                onChange={(event) => form.setData('header_3', event.target.value)}
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                            />
                            <InputError message={form.errors.header_3} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.text.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700">
                                Save text
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
