import { UserFormFields, type RoleOption, type UserFormData } from '@/components/admin/user-form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

interface EditableUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role_id: number | null;
    status: string;
}

export default function EditUser({ managedUser, roles }: { managedUser: EditableUser; roles: RoleOption[] }) {
    const form = useForm<UserFormData>({
        name: managedUser.name,
        email: managedUser.email,
        phone: managedUser.phone ?? '',
        role_id: managedUser.role_id?.toString() ?? '',
        status: managedUser.status,
        password: '',
        password_confirmation: '',
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: managedUser.name, href: `/admin/users/${managedUser.id}/edit` },
    ];

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        form.put(route('admin.users.update', managedUser.id));
    }

    return (
        <AdminLayout title="Edit User" breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${managedUser.name}`} />
            <Card className="mx-auto w-full max-w-2xl border-emerald-950/10 shadow-sm">
                <CardHeader>
                    <CardTitle>Edit user</CardTitle>
                    <CardDescription>Update account details, status, or optionally set a new password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <UserFormFields data={form.data} errors={form.errors} onChange={form.setData} roles={roles} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.users.index')}>Cancel</Link>
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
