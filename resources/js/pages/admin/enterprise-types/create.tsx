import { EnterpriseTypeForm, type EnterpriseTypeFormData, type WebsiteModuleOption } from '@/components/admin/enterprise-type-form';
import { LoadingButton } from '@/components/admin/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

export default function CreateEnterpriseType({ websiteModules }: { websiteModules: WebsiteModuleOption[] }) {
    const form = useForm<EnterpriseTypeFormData>({ name: '', description: '', status: 'active', website_modules: [] });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Enterprise Types', href: '/admin/enterprise-types' },
        { title: 'Create', href: '/admin/enterprise-types/create' },
    ];
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('admin.enterprise-types.store'));
    }
    return (
        <AdminLayout title="Create Enterprise Type" breadcrumbs={breadcrumbs}>
            <Head title="Create Enterprise Type" />
            <Card className="mx-auto w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Create enterprise type</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <EnterpriseTypeForm data={form.data} errors={form.errors} onChange={form.setData} websiteModules={websiteModules} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.enterprise-types.index')}>Cancel</Link>
                            </Button>
                            <LoadingButton loading={form.processing}>Create enterprise type</LoadingButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
