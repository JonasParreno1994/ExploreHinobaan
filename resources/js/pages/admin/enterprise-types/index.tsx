import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { DataTable, type DataTableColumn } from '@/components/admin/data-table';
import { EmptyState } from '@/components/admin/empty-state';
import { PageHeader } from '@/components/admin/page-header';
import { Pagination, type LaravelPaginator } from '@/components/admin/pagination';
import { SearchInput } from '@/components/admin/search-input';
import { StatusBadge } from '@/components/admin/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Pencil, Plus, Power } from 'lucide-react';
import { useCallback, useState } from 'react';

export interface EnterpriseType {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    status: 'active' | 'inactive';
    enterprises_count: number;
}
interface EnterpriseTypePaginator extends LaravelPaginator {
    data: EnterpriseType[];
    total: number;
}
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Enterprise Types', href: '/admin/enterprise-types' },
];

export default function EnterpriseTypeIndex({ enterpriseTypes, filters }: { enterpriseTypes: EnterpriseTypePaginator; filters: { search: string } }) {
    const [search, setSearch] = useState(filters.search);
    const [selected, setSelected] = useState<EnterpriseType | null>(null);
    const visit = useCallback(
        (value: string) => router.get('/admin/enterprise-types', value ? { search: value } : {}, { preserveState: true, replace: true }),
        [],
    );
    const columns: DataTableColumn<EnterpriseType>[] = [
        {
            header: 'Enterprise type',
            cell: (item) => (
                <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-muted-foreground text-xs">/{item.slug}</p>
                </div>
            ),
        },
        { header: 'Description', cell: (item) => <p className="text-muted-foreground min-w-64">{item.description ?? 'No description'}</p> },
        {
            header: 'Used by',
            cell: (item) => (
                <Badge variant="outline">
                    {item.enterprises_count} {item.enterprises_count === 1 ? 'enterprise' : 'enterprises'}
                </Badge>
            ),
        },
        { header: 'Status', cell: (item) => <StatusBadge status={item.status} /> },
    ];
    function changeStatus(): void {
        if (!selected) return;
        const action = selected.status === 'active' ? 'deactivate' : 'activate';
        router.patch(route(`admin.enterprise-types.${action}`, selected.id), {}, { onFinish: () => setSelected(null) });
    }
    return (
        <AdminLayout title="Enterprise Types" breadcrumbs={breadcrumbs}>
            <Head title="Enterprise Types" />
            <PageHeader
                title="Enterprise Types"
                description="Manage the classifications available to tourism enterprises."
                actions={
                    <Button asChild className="bg-emerald-700">
                        <Link href={route('admin.enterprise-types.create')}>
                            <Plus />
                            Add enterprise type
                        </Link>
                    </Button>
                }
            />
            <Card>
                <CardContent className="p-5">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSearch={(value) => visit(value ?? search)}
                        onClear={() => {
                            setSearch('');
                            visit('');
                        }}
                        placeholder="Search enterprise types"
                    />
                </CardContent>
                <DataTable
                    columns={columns}
                    rows={enterpriseTypes.data}
                    emptyState={
                        <EmptyState
                            icon={<Building2 className="size-6" />}
                            title="No enterprise types found"
                            description="Add a type or adjust your search."
                        />
                    }
                    actions={(item) => (
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild title="Edit">
                                <Link href={route('admin.enterprise-types.edit', item.id)}>
                                    <Pencil />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                title={item.status === 'active' ? 'Deactivate' : 'Activate'}
                                onClick={() => setSelected(item)}
                            >
                                <Power className={item.status === 'active' ? 'text-red-600' : 'text-emerald-700'} />
                            </Button>
                        </div>
                    )}
                />
                <Pagination
                    currentPage={enterpriseTypes.current_page}
                    lastPage={enterpriseTypes.last_page}
                    previousUrl={enterpriseTypes.prev_page_url}
                    nextUrl={enterpriseTypes.next_page_url}
                />
            </Card>
            <ConfirmDialog
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
                title={`${selected?.status === 'active' ? 'Deactivate' : 'Activate'} enterprise type?`}
                description={`${selected?.name ?? 'This type'} will ${selected?.status === 'active' ? 'no longer be available for new applications. Existing enterprises remain unchanged.' : 'be available for new applications again.'}`}
                confirmLabel={selected?.status === 'active' ? 'Deactivate' : 'Activate'}
                onConfirm={changeStatus}
            />
        </AdminLayout>
    );
}
