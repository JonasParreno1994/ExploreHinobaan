import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { type Barangay } from './index';

export default function ShowBarangay({ barangay }: { barangay: Barangay }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Barangays', href: '/admin/barangays' },
        { title: barangay.name, href: `/admin/barangays/${barangay.id}` },
    ];
    return (
        <AdminLayout title="Barangay Details" breadcrumbs={breadcrumbs}>
            <Head title={barangay.name} />
            <Card className="mx-auto w-full max-w-2xl">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>{barangay.name}</CardTitle>
                    <StatusBadge status={barangay.status} />
                </CardHeader>
                <CardContent className="grid gap-5">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-muted-foreground text-sm">PSGC code</dt>
                            <dd className="font-medium">{barangay.psgc_code}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-sm">Slug</dt>
                            <dd className="font-medium">{barangay.slug}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-sm">Classification</dt>
                            <dd className="font-medium capitalize">{barangay.classification}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-sm">Population</dt>
                            <dd className="font-medium">{barangay.population?.toLocaleString('en-PH') ?? 'Not set'}</dd>
                        </div>
                    </dl>
                    <div className="flex justify-end gap-2 border-t pt-5">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.barangays.index')}>Back</Link>
                        </Button>
                        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                            <Link href={route('admin.barangays.edit', barangay.id)}>Edit barangay</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
