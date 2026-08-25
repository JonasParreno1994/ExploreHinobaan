import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, Landmark, Pencil, Plus } from 'lucide-react';
export interface LguEntry {
    id: number;
    history: string;
    mission: string;
    vision: string;
    area: string;
    number_of_barangays: number;
    location: string;
    images: string[];
    image_urls: string[];
    created_at: string;
    updated_at: string;
}
interface Entries {
    data: LguEntry[];
    total: number;
}
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'LGU Information', href: '/admin/lgu-information' },
];
export default function LguInformationIndex({ entries }: { entries: Entries }) {
    return (
        <AdminLayout title="LGU Information" breadcrumbs={breadcrumbs}>
            <Head title="LGU Information" />
            <Card>
                <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Landmark className="text-emerald-700" />
                            LGU Information
                        </CardTitle>
                        <CardDescription>Municipal history, direction, location, and image collection.</CardDescription>
                    </div>
                    <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                        <Link href={route('admin.lgu-information.create')}>
                            <Plus />
                            Add information
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {entries.data.length ? (
                        <div className="grid gap-5 md:grid-cols-2">
                            {entries.data.map((entry) => (
                                <article key={entry.id} className="overflow-hidden rounded-xl border">
                                    <div className="grid grid-cols-5">
                                        {entry.image_urls.slice(0, 5).map((url, i) => (
                                            <img key={url} src={url} alt={`LGU image ${i + 1}`} className="aspect-square w-full object-cover" />
                                        ))}
                                    </div>
                                    <div className="grid gap-3 p-5">
                                        <h3 className="font-semibold">{entry.location}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            {entry.area} km² · {entry.number_of_barangays} barangays · {entry.image_urls.length} images
                                        </p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.lgu-information.show', entry.id)}>
                                                    <Eye />
                                                    View
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.lgu-information.edit', entry.id)}>
                                                    <Pencil />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground py-16 text-center text-sm">No LGU information has been added yet.</div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
