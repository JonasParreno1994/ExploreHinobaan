import { EnterpriseTypeForm, type EnterpriseTypeFormData, type WebsiteModuleOption } from '@/components/admin/enterprise-type-form';
import { LoadingButton } from '@/components/admin/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { type EnterpriseType } from './index';

export default function EditEnterpriseType({ enterpriseType, websiteModules }: { enterpriseType: EnterpriseType & { website_modules: string[] }; websiteModules: WebsiteModuleOption[] }) {
    const form = useForm<EnterpriseTypeFormData>({
        name: enterpriseType.name,
        description: enterpriseType.description ?? '',
        status: enterpriseType.status,
        website_modules: enterpriseType.website_modules ?? [],
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Enterprise Types', href: '/admin/enterprise-types' },
        { title: 'Edit', href: `/admin/enterprise-types/${enterpriseType.id}/edit` },
    ];
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.put(route('admin.enterprise-types.update', enterpriseType.id));
    }
    return (
        <AdminLayout title="Edit Enterprise Type" breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${enterpriseType.name}`} />
            <Card className="mx-auto w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Edit enterprise type</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <EnterpriseTypeForm data={form.data} errors={form.errors} onChange={form.setData} websiteModules={websiteModules} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.enterprise-types.index')}>Cancel</Link>
                            </Button>
                            <LoadingButton loading={form.processing}>Save changes</LoadingButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
