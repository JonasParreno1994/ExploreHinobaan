import { LguInformationForm, type LguInformationFormData } from '@/components/admin/lgu-information-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'LGU Information', href: '/admin/lgu-information' },
    { title: 'Create', href: '/admin/lgu-information/create' },
];
export default function CreateLguInformation() {
    const form = useForm<LguInformationFormData>({
        history: '',
        mission: '',
        vision: '',
        area: '',
        number_of_barangays: '13',
        location: 'Hinoba-an, Negros Occidental',
        images: [],
    });
    function submit(e: FormEvent): void {
        e.preventDefault();
        form.post(route('admin.lgu-information.store'), { forceFormData: true });
    }
    return (
        <AdminLayout title="Add LGU Information" breadcrumbs={breadcrumbs}>
            <Head title="Add LGU Information" />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Add LGU information</CardTitle>
                    <CardDescription>Provide the municipality profile and upload at least five images.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <LguInformationForm data={form.data} errors={form.errors} onChange={form.setData} imagesRequired />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.lgu-information.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700 hover:bg-emerald-800">
                                Save information
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
