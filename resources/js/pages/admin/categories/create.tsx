import { LoadingButton } from '@/components/admin/loading-button';
import { TourismCategoryForm, type TourismCategoryFormData } from '@/components/admin/tourism-category-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
    { title: 'Create', href: '/admin/categories/create' },
];

export default function CreateTourismCategory() {
    const form = useForm<TourismCategoryFormData>({ name: '', description: '', icon: '', status: 'active' });
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('admin.categories.store'));
    }

    return (
        <AdminLayout title="Add Tourism Category" breadcrumbs={breadcrumbs}>
            <Head title="Add Tourism Category" />
            <Card className="mx-auto w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Add tourism category</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <TourismCategoryForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.categories.index')}>Cancel</Link>
                            </Button>
                            <LoadingButton type="submit" loading={form.processing} loadingLabel="Creating…" className="bg-emerald-700">
                                Create category
                            </LoadingButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
