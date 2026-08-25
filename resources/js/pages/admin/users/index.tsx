import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useInitials } from '@/hooks/use-initials';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, UserRound, UsersRound, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface ManagedUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: { id: number; name: string } | null;
    status: 'active' | 'inactive' | 'suspended';
    email_verified_at: string | null;
    created_at: string;
}

interface PaginatedUsers {
    data: ManagedUser[];
    current_page: number;
    from: number | null;
    last_page: number;
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

interface UserIndexProps {
    filters: { search: string };
    users: PaginatedUsers;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

function formatRegistrationDate(value: string): string {
    return new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function UserIndex({ filters, users }: UserIndexProps) {
    const [search, setSearch] = useState(filters.search);
    const getInitials = useInitials();
    const currentUser = usePage<SharedData>().props.auth.user;

    function submitSearch(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        router.get('/admin/users', search.trim() ? { search: search.trim() } : {}, {
            preserveState: true,
            replace: true,
        });
    }

    function clearSearch(): void {
        setSearch('');
        router.get('/admin/users', {}, { preserveState: true, replace: true });
    }

    function deleteUser(user: ManagedUser): void {
        if (window.confirm(`Delete ${user.name}? This action cannot be undone.`)) {
            router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    }

    const statusStyles: Record<ManagedUser['status'], string> = {
        active: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
        inactive: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
        suspended: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
    };

    return (
        <AdminLayout title="Users" breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <Card className="overflow-hidden border-emerald-950/10 shadow-sm">
                <CardHeader className="dark:bg-card gap-5 border-b border-emerald-950/10 bg-white sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <CardTitle className="flex items-center gap-2 text-xl text-emerald-950 dark:text-emerald-50">
                            <UsersRound className="size-5 text-emerald-700" />
                            User Management
                        </CardTitle>
                        <CardDescription>View registered accounts from the users table.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="w-fit bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                            {users.total} {users.total === 1 ? 'user' : 'users'}
                        </Badge>
                        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                            <Link href={route('admin.users.create')}>
                                <Plus />
                                Add user
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <form onSubmit={submitSearch} className="flex flex-col gap-3 border-b border-emerald-950/10 p-4 sm:flex-row sm:items-center">
                        <div className="relative max-w-md flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by name or email"
                                aria-label="Search users"
                                className="dark:bg-background border-emerald-950/15 bg-white pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                                Search
                            </Button>
                            {filters.search && (
                                <Button type="button" variant="outline" onClick={clearSearch}>
                                    <X className="size-4" /> Clear
                                </Button>
                            )}
                        </div>
                    </form>

                    {users.data.length > 0 ? (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-emerald-50/70 text-xs tracking-wide text-emerald-950/60 uppercase dark:bg-emerald-950/20 dark:text-emerald-100/60">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">User</th>
                                            <th className="px-6 py-3 font-semibold">Email</th>
                                            <th className="px-6 py-3 font-semibold">Role</th>
                                            <th className="px-6 py-3 font-semibold">Status</th>
                                            <th className="px-6 py-3 font-semibold">Verification</th>
                                            <th className="px-6 py-3 font-semibold">Registered</th>
                                            <th className="px-6 py-3 text-right font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-950/10">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-9">
                                                            <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                                                                {getInitials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-foreground font-medium">{user.name}</p>
                                                            <p className="text-muted-foreground text-xs">ID #{user.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-muted-foreground px-6 py-4">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="secondary">{user.role?.name || 'Unassigned'}</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={`capitalize ${statusStyles[user.status]}`}>
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline">{user.email_verified_at ? 'Verified' : 'Pending'}</Badge>
                                                </td>
                                                <td className="text-muted-foreground px-6 py-4">{formatRegistrationDate(user.created_at)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('admin.users.show', user.id)} aria-label={`View ${user.name}`}>
                                                                <Eye />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('admin.users.edit', user.id)} aria-label={`Edit ${user.name}`}>
                                                                <Pencil />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={currentUser.id === user.id}
                                                            onClick={() => deleteUser(user)}
                                                            aria-label={`Delete ${user.name}`}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="divide-y divide-emerald-950/10 md:hidden">
                                {users.data.map((user) => (
                                    <article key={user.id} className="flex gap-3 p-4">
                                        <Avatar className="size-10">
                                            <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-800">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="truncate font-medium">{user.name}</p>
                                                <Badge variant="outline" className={`shrink-0 capitalize ${statusStyles[user.status]}`}>
                                                    {user.status}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground truncate text-sm">{user.email}</p>
                                            <p className="text-muted-foreground truncate text-sm">
                                                {user.phone || 'No phone number'} · {user.role?.name || 'No role'}
                                            </p>
                                            <p className="text-muted-foreground text-xs">Registered {formatRegistrationDate(user.created_at)}</p>
                                            <div className="flex gap-1 pt-1">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.users.show', user.id)}>View</Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.users.edit', user.id)}>Edit</Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={currentUser.id === user.id}
                                                    onClick={() => deleteUser(user)}
                                                    className="text-red-600"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950">
                                <UserRound className="size-6" />
                            </span>
                            <div>
                                <p className="font-medium">No users found</p>
                                <p className="text-muted-foreground text-sm">Try a different name or email address.</p>
                            </div>
                        </div>
                    )}

                    {users.total > users.per_page && (
                        <div className="flex flex-col gap-3 border-t border-emerald-950/10 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-muted-foreground">
                                Showing {users.from}–{users.to} of {users.total}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild={Boolean(users.prev_page_url)} disabled={!users.prev_page_url}>
                                    {users.prev_page_url ? (
                                        <Link href={users.prev_page_url} preserveScroll>
                                            Previous
                                        </Link>
                                    ) : (
                                        <span>Previous</span>
                                    )}
                                </Button>
                                <span className="text-muted-foreground flex items-center px-2">
                                    Page {users.current_page} of {users.last_page}
                                </span>
                                <Button variant="outline" size="sm" asChild={Boolean(users.next_page_url)} disabled={!users.next_page_url}>
                                    {users.next_page_url ? (
                                        <Link href={users.next_page_url} preserveScroll>
                                            Next
                                        </Link>
                                    ) : (
                                        <span>Next</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
