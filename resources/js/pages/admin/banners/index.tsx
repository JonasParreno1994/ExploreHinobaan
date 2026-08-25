import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Images, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
export interface Banner {
    id: number;
    images: string[];
    image_urls: string[];
    sentences: string[];
    text_content: { header_1: string | null; header_2: string | null; header_3: string | null } | null;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}
export default function BannerIndex({ banners }: { banners: { data: Banner[] } }) {
    const [selected, setSelected] = useState<Banner | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Banners', href: '/admin/banners' },
    ];
    function remove(): void {
        if (selected) router.delete(route('admin.banners.destroy', selected.id), { onFinish: () => setSelected(null) });
    }
    return (
        <AdminLayout title="Banners" breadcrumbs={breadcrumbs}>
            <Head title="Banners" />
            <Card>
                <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Images className="text-emerald-700" />
                            Banners
                        </CardTitle>
                        <CardDescription>Manage banner pictures and display sentences.</CardDescription>
                    </div>
                    <Button asChild className="bg-emerald-700">
                        <Link href={route('admin.banners.create')}>
                            <Plus />
                            Add pictures
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {banners.data.length ? (
                        <div className="grid gap-5 md:grid-cols-2">
                            {banners.data.map((banner) => (
                                <article key={banner.id} className="overflow-hidden rounded-xl border">
                                    <div className="grid grid-cols-3">
                                        {banner.image_urls.slice(0, 3).map((url, i) => (
                                            <img
                                                key={url}
                                                src={url}
                                                alt={`Banner picture ${i + 1}`}
                                                className="aspect-video h-full w-full object-cover"
                                            />
                                        ))}
                                    </div>
                                    <div className="grid gap-3 p-5">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold">Banner #{banner.id}</h3>
                                            <span className="text-muted-foreground text-xs capitalize">{banner.status}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            {banner.image_urls.length} pictures · {banner.sentences.length} sentences
                                        </p>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.banners.show', banner.id)}>
                                                    <Eye />
                                                    View
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.banners.edit', banner.id)}>
                                                    <Pencil />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => setSelected(banner)} className="text-red-600">
                                                <Trash2 />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground py-16 text-center">No banners yet.</div>
                    )}
                </CardContent>
            </Card>
            <ConfirmDialog
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
                title="Delete banner?"
                description="The banner and all of its stored pictures will be permanently deleted."
                confirmLabel="Delete banner"
                onConfirm={remove}
            />
        </AdminLayout>
    );
}
