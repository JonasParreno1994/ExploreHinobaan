import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface DetailedUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: { id: number; name: string } | null;
    status: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export default function ShowUser({ managedUser }: { managedUser: DetailedUser }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: managedUser.name, href: `/admin/users/${managedUser.id}` },
    ];

    return (
        <AdminLayout title="User Details" breadcrumbs={breadcrumbs}>
            <Head title={managedUser.name} />
            <Card className="mx-auto w-full max-w-2xl border-emerald-950/10 shadow-sm">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>{managedUser.name}</CardTitle>
                    <Badge className="capitalize">{managedUser.status}</Badge>
                </CardHeader>
                <CardContent className="grid gap-5">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-muted-foreground text-sm">Email</dt>
                            <dd className="font-medium">{managedUser.email}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-sm">Email verification</dt>
                            <dd className="font-medium">{managedUser.email_verified_at ? 'Verified' : 'Pending'}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-sm">Phone number</dt>
                            <dd className="font-medium">{managedUser.phone || 'Not provided'}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-sm">Role</dt>
                            <dd className="font-medium">{managedUser.role?.name || 'No role assigned'}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-sm">Registered</dt>
                            <dd className="font-medium">{new Date(managedUser.created_at).toLocaleString('en-PH')}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-sm">Last updated</dt>
                            <dd className="font-medium">{new Date(managedUser.updated_at).toLocaleString('en-PH')}</dd>
                        </div>
                    </dl>
                    <div className="flex justify-end gap-2 border-t pt-5">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.users.index')}>Back</Link>
                        </Button>
                        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                            <Link href={route('admin.users.edit', managedUser.id)}>Edit user</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
