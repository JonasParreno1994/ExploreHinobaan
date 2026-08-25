import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { type LguEntry } from './index';
export default function ShowLguInformation({ entry }: { entry: LguEntry }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'LGU Information', href: '/admin/lgu-information' },
        { title: entry.location, href: `/admin/lgu-information/${entry.id}` },
    ];
    return (
        <AdminLayout title="LGU Information Details" breadcrumbs={breadcrumbs}>
            <Head title="LGU Information Details" />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader className="flex-row justify-between">
                    <CardTitle>{entry.location}</CardTitle>
                    <Button asChild>
                        <Link href={route('admin.lgu-information.edit', entry.id)}>Edit</Link>
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                        {entry.image_urls.map((url, i) => (
                            <img key={url} src={url} alt={`LGU image ${i + 1}`} className="aspect-square w-full rounded-xl object-cover" />
                        ))}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-muted-foreground text-sm">Area</p>
                            <p className="font-semibold">{entry.area} km²</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">Number of barangays</p>
                            <p className="font-semibold">{entry.number_of_barangays}</p>
                        </div>
                    </div>
                    {[
                        ['History', entry.history],
                        ['Mission', entry.mission],
                        ['Vision', entry.vision],
                    ].map(([title, text]) => (
                        <section key={title}>
                            <h3 className="mb-2 text-lg font-semibold text-emerald-950 dark:text-emerald-50">{title}</h3>
                            <p className="text-muted-foreground text-sm leading-7 whitespace-pre-line">{text}</p>
                        </section>
                    ))}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
