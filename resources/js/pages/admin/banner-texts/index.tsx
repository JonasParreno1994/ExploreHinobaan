import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Type } from 'lucide-react';
import { type Banner } from '../banners/index';

export default function BannerTextIndex({ banners }: { banners: { data: Banner[] } }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Text', href: '/admin/text' },
    ];

    return (
        <AdminLayout title="Text" breadcrumbs={breadcrumbs}>
            <Head title="Text" />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Type className="text-emerald-700" />
                        Text
                    </CardTitle>
                    <CardDescription>Edit landing-page headings separately from banner picture uploads.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {banners.data.map((banner) => (
                        <article key={banner.id} className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <img src={banner.image_urls[0]} alt="" className="h-20 w-32 rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-semibold">Banner #{banner.id}</h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {banner.text_content?.header_2 || 'No carousel heading configured'}
                                    </p>
                                </div>
                            </div>
                            <Button asChild className="bg-emerald-700">
                                <Link href={route('admin.text.edit', banner.id)}>
                                    <Pencil />
                                    Edit text
                                </Link>
                            </Button>
                        </article>
                    ))}
                    {banners.data.length === 0 && <p className="text-muted-foreground py-12 text-center">Create a picture banner first.</p>}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
