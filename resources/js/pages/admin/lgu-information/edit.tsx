import { LguInformationForm, type LguInformationFormData } from '@/components/admin/lgu-information-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type LguEntry } from './index';
export default function EditLguInformation({ entry }: { entry: LguEntry }) {
    const form = useForm<LguInformationFormData>({
        history: entry.history,
        mission: entry.mission,
        vision: entry.vision,
        area: entry.area,
        number_of_barangays: entry.number_of_barangays.toString(),
        location: entry.location,
        images: [],
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'LGU Information', href: '/admin/lgu-information' },
        { title: 'Edit', href: `/admin/lgu-information/${entry.id}/edit` },
    ];
    function submit(e: FormEvent): void {
        e.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.lgu-information.update', entry.id), { forceFormData: true });
    }
    return (
        <AdminLayout title="Edit LGU Information" breadcrumbs={breadcrumbs}>
            <Head title="Edit LGU Information" />
            <Card className="mx-auto w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Edit LGU information</CardTitle>
                    <CardDescription>Existing images are retained. You may upload additional images.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {entry.image_urls.map((url, i) => (
                            <img key={url} src={url} alt={`Existing LGU image ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                        ))}
                    </div>
                    <form onSubmit={submit} className="grid gap-6">
                        <LguInformationForm data={form.data} errors={form.errors} onChange={form.setData} imagesRequired={false} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.lgu-information.index')}>Cancel</Link>
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
