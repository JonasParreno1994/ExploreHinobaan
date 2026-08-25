import { UserFormFields, type RoleOption, type UserFormData } from '@/components/admin/user-form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Create', href: '/admin/users/create' },
];

export default function CreateUser({ roles }: { roles: RoleOption[] }) {
    const form = useForm<UserFormData>({ name: '', email: '', phone: '', role_id: '', status: 'active', password: '', password_confirmation: '' });

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        form.post(route('admin.users.store'));
    }

    return (
        <AdminLayout title="Create User" breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <Card className="mx-auto w-full max-w-2xl border-emerald-950/10 shadow-sm">
                <CardHeader>
                    <CardTitle>Create user</CardTitle>
                    <CardDescription>Add a new account and choose its initial status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <UserFormFields data={form.data} errors={form.errors} onChange={form.setData} roles={roles} passwordRequired />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.users.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700 hover:bg-emerald-800">
                                Create user
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
