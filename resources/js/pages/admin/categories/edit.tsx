import { LoadingButton } from '@/components/admin/loading-button';
import { TourismCategoryForm, type TourismCategoryFormData } from '@/components/admin/tourism-category-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type TourismCategory } from './index';

export default function EditTourismCategory({ category }: { category: TourismCategory }) {
    const form = useForm<TourismCategoryFormData>({
        name: category.name,
        description: category.description ?? '',
        icon: category.icon ?? '',
        status: category.status,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Categories', href: '/admin/categories' },
        { title: 'Edit', href: `/admin/categories/${category.id}/edit` },
    ];
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.put(route('admin.categories.update', category.id));
    }

    return (
        <AdminLayout title="Edit Tourism Category" breadcrumbs={breadcrumbs}>
            <Head title="Edit Tourism Category" />
            <Card className="mx-auto w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Edit {category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <TourismCategoryForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.categories.index')}>Cancel</Link>
                            </Button>
                            <LoadingButton type="submit" loading={form.processing} loadingLabel="Saving…" className="bg-emerald-700">
                                Save changes
                            </LoadingButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
