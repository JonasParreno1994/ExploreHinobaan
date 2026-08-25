import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, GalleryHorizontalEnd, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface Gallery {
    id: number;
    images: string[];
    image_urls: string[];
    status: 'active' | 'inactive';
}

interface GalleryPaginator {
    data: Gallery[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

export default function GalleryIndex({ galleries }: { galleries: GalleryPaginator }) {
    const [selected, setSelected] = useState<Gallery | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gallery', href: '/admin/gallery' },
    ];

    function remove(): void {
        if (selected) {
            router.delete(route('admin.gallery.destroy', selected.id), { onFinish: () => setSelected(null) });
        }
    }

    return (
        <AdminLayout title="Gallery" breadcrumbs={breadcrumbs}>
            <Head title="Gallery" />
            <Card>
                <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <GalleryHorizontalEnd className="text-emerald-700" />
                            Gallery
                        </CardTitle>
                        <CardDescription>Manage collections of tourism gallery pictures.</CardDescription>
                    </div>
                    <Button asChild className="bg-emerald-700">
                        <Link href={route('admin.gallery.create')}>
                            <Plus />
                            Add pictures
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {galleries.data.length ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {galleries.data.map((gallery) => (
                                <article key={gallery.id} className="overflow-hidden rounded-xl border">
                                    <div className="grid grid-cols-2">
                                        {gallery.image_urls.slice(0, 4).map((url, index) => (
                                            <img
                                                key={url}
                                                src={url}
                                                alt={`Gallery picture ${index + 1}`}
                                                className="aspect-square h-full w-full object-cover"
                                            />
                                        ))}
                                    </div>
                                    <div className="grid gap-3 p-5">
                                        <div className="flex justify-between gap-3">
                                            <h3 className="font-semibold">Gallery #{gallery.id}</h3>
                                            <span className="text-muted-foreground text-xs capitalize">{gallery.status}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm">{gallery.image_urls.length} pictures</p>
                                        <div className="flex flex-wrap gap-1">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.gallery.show', gallery.id)}>
                                                    <Eye />
                                                    View
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.gallery.edit', gallery.id)}>
                                                    <Pencil />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => setSelected(gallery)} className="text-red-600">
                                                <Trash2 />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground py-16 text-center">No gallery pictures yet.</div>
                    )}
                </CardContent>
                <Pagination
                    currentPage={galleries.current_page}
                    lastPage={galleries.last_page}
                    previousUrl={galleries.prev_page_url}
                    nextUrl={galleries.next_page_url}
                />
            </Card>
            <ConfirmDialog
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
                title="Delete gallery?"
                description="This gallery and all of its stored pictures will be permanently deleted."
                confirmLabel="Delete gallery"
                onConfirm={remove}
            />
        </AdminLayout>
    );
}
