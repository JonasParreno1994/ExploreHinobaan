import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { type FormEvent } from 'react';

interface Role {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
}

interface PaginatedRoles {
    data: Role[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/admin/roles' },
];

export default function RoleIndex({ roles }: { roles: PaginatedRoles }) {
    const form = useForm({ name: '', description: '' });

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        form.post(route('admin.roles.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    function deleteRole(role: Role): void {
        if (window.confirm(`Delete the ${role.name} role?`)) {
            router.delete(route('admin.roles.destroy', role.id), { preserveScroll: true });
        }
    }

    return (
        <AdminLayout title="Roles" breadcrumbs={breadcrumbs}>
            <Head title="Role Management" />

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(20rem,24rem)_1fr]">
                <Card className="border-emerald-950/10 shadow-sm xl:sticky xl:top-24">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl text-emerald-950 dark:text-emerald-50">
                            <Plus className="size-5 text-emerald-700" /> Add Role
                        </CardTitle>
                        <CardDescription>Create a role that can later be assigned permissions and users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Role name</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    placeholder="e.g. Tourism Officer"
                                    required
                                    autoFocus
                                />
                                <InputError message={form.errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(event) => form.setData('description', event.target.value)}
                                    placeholder="Describe this role's responsibility"
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
                                />
                                <InputError message={form.errors.description} />
                            </div>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700 hover:bg-emerald-800">
                                <Plus className="size-4" /> Add role
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-emerald-950/10 shadow-sm">
                    <CardHeader className="flex-row items-center justify-between border-b border-emerald-950/10">
                        <div className="space-y-1.5">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <ShieldCheck className="size-5 text-emerald-700" /> Roles
                            </CardTitle>
                            <CardDescription>Roles created for the administration system.</CardDescription>
                        </div>
                        <Badge variant="secondary">{roles.total}</Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        {roles.data.length > 0 ? (
                            <div className="divide-y divide-emerald-950/10">
                                {roles.data.map((role) => (
                                    <article
                                        key={role.id}
                                        className="flex items-start gap-4 p-5 transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10"
                                    >
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                                            <ShieldCheck className="size-5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-foreground font-semibold">{role.name}</h3>
                                            <p className="text-muted-foreground mt-1 text-sm">{role.description || 'No description provided.'}</p>
                                            <p className="text-muted-foreground mt-2 text-xs">
                                                Created {new Date(role.created_at).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteRole(role)}
                                            className="shrink-0 text-red-600 hover:text-red-700"
                                            aria-label={`Delete ${role.name}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                                <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950">
                                    <ShieldCheck className="size-6" />
                                </span>
                                <div>
                                    <p className="font-medium">No roles yet</p>
                                    <p className="text-muted-foreground text-sm">Use the form to add your first role.</p>
                                </div>
                            </div>
                        )}

                        {roles.last_page > 1 && (
                            <div className="flex items-center justify-between gap-3 border-t border-emerald-950/10 px-5 py-3 text-sm">
                                <span className="text-muted-foreground">
                                    Page {roles.current_page} of {roles.last_page}
                                </span>
                                <div className="flex gap-2">
                                    {roles.prev_page_url ? (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={roles.prev_page_url}>Previous</Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>
                                            Previous
                                        </Button>
                                    )}
                                    {roles.next_page_url ? (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={roles.next_page_url}>Next</Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
