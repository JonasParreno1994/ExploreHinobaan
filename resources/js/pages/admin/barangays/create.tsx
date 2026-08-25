import { BarangayForm, type BarangayFormData } from '@/components/admin/barangay-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Barangays', href: '/admin/barangays' },
    { title: 'Create', href: '/admin/barangays/create' },
];
export default function CreateBarangay() {
    const form = useForm<BarangayFormData>({ psgc_code: '', name: '', classification: 'rural', population: '', status: 'active' });
    function submit(e: FormEvent): void {
        e.preventDefault();
        form.post(route('admin.barangays.store'));
    }
    return (
        <AdminLayout title="Add Barangay" breadcrumbs={breadcrumbs}>
            <Head title="Add Barangay" />
            <Card className="mx-auto w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Add barangay</CardTitle>
                    <CardDescription>The slug is generated automatically from the name.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <BarangayForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.barangays.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700 hover:bg-emerald-800">
                                Create barangay
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
