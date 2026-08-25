import { BarangayForm, type BarangayFormData } from '@/components/admin/barangay-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type Barangay } from './index';

export default function EditBarangay({ barangay }: { barangay: Barangay }) {
    const form = useForm<BarangayFormData>({
        psgc_code: barangay.psgc_code,
        name: barangay.name,
        classification: barangay.classification,
        population: barangay.population?.toString() ?? '',
        status: barangay.status,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Barangays', href: '/admin/barangays' },
        { title: barangay.name, href: `/admin/barangays/${barangay.id}/edit` },
    ];
    function submit(e: FormEvent): void {
        e.preventDefault();
        form.put(route('admin.barangays.update', barangay.id));
    }
    return (
        <AdminLayout title="Edit Barangay" breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${barangay.name}`} />
            <Card className="mx-auto w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Edit barangay</CardTitle>
                    <CardDescription>Changing the name automatically refreshes its slug.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <BarangayForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.barangays.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700 hover:bg-emerald-800">
                                Save changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
