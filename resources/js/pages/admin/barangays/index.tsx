import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { DataTable, type DataTableColumn } from '@/components/admin/data-table';
import { Pagination } from '@/components/admin/pagination';
import { SearchInput } from '@/components/admin/search-input';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, MapPinned, Pencil, Plus, Power } from 'lucide-react';
import { useState } from 'react';

export interface Barangay {
    id: number;
    psgc_code: string;
    name: string;
    slug: string;
    classification: 'urban' | 'rural';
    population: number | null;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}
interface PaginatedBarangays {
    data: Barangay[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
}
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Barangays', href: '/admin/barangays' },
];

export default function BarangayIndex({ barangays, filters }: { barangays: PaginatedBarangays; filters: { search: string } }) {
    const [search, setSearch] = useState(filters.search);
    const [selected, setSelected] = useState<Barangay | null>(null);
    const columns: DataTableColumn<Barangay>[] = [
        {
            header: 'Barangay',
            cell: (row) => (
                <div>
                    <p className="font-medium">{row.name}</p>
                    <p className="text-muted-foreground text-xs">{row.psgc_code}</p>
                </div>
            ),
        },
        { header: 'Classification', cell: (row) => <span className="capitalize">{row.classification}</span> },
        { header: 'Population', cell: (row) => row.population?.toLocaleString('en-PH') ?? 'Not set' },
        { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (row) => (
                <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('admin.barangays.show', row.id)} aria-label={`View ${row.name}`}>
                            <Eye />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('admin.barangays.edit', row.id)} aria-label={`Edit ${row.name}`}>
                            <Pencil />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelected(row)}
                        aria-label={`${row.status === 'active' ? 'Deactivate' : 'Activate'} ${row.name}`}
                    >
                        <Power className={row.status === 'active' ? 'text-amber-600' : 'text-emerald-700'} />
                    </Button>
                </div>
            ),
        },
    ];
    function applySearch(): void {
        router.get('/admin/barangays', search.trim() ? { search: search.trim() } : {}, { preserveState: true, replace: true });
    }
    function clearSearch(): void {
        setSearch('');
        router.get('/admin/barangays', {}, { preserveState: true, replace: true });
    }
    function changeStatus(): void {
        if (!selected) return;
        const action = selected.status === 'active' ? 'deactivate' : 'activate';
        router.patch(`/admin/barangays/${selected.id}/${action}`, {}, { preserveScroll: true, onFinish: () => setSelected(null) });
    }

    return (
        <AdminLayout title="Barangays" breadcrumbs={breadcrumbs}>
            <Head title="Barangays" />
            <Card className="overflow-hidden border-emerald-950/10 shadow-sm">
                <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <MapPinned className="text-emerald-700" />
                            Barangays
                        </CardTitle>
                        <CardDescription>Manage Hinoba-an barangay records without permanent deletion.</CardDescription>
                    </div>
                    <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                        <Link href={route('admin.barangays.create')}>
                            <Plus />
                            Add barangay
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-b p-4">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSearch={applySearch}
                            onClear={clearSearch}
                            placeholder="Search name or PSGC code"
                        />
                    </div>
                    <DataTable columns={columns} rows={barangays.data} emptyMessage="No barangays found." />
                    <Pagination
                        currentPage={barangays.current_page}
                        lastPage={barangays.last_page}
                        previousUrl={barangays.prev_page_url}
                        nextUrl={barangays.next_page_url}
                    />
                </CardContent>
            </Card>
            <ConfirmDialog
                open={selected !== null}
                onOpenChange={(open) => !open && setSelected(null)}
                title={`${selected?.status === 'active' ? 'Deactivate' : 'Activate'} barangay?`}
                description={`${selected?.name ?? 'This barangay'} will be marked ${selected?.status === 'active' ? 'inactive' : 'active'}. No data will be deleted.`}
                confirmLabel={selected?.status === 'active' ? 'Deactivate' : 'Activate'}
                onConfirm={changeStatus}
            />
        </AdminLayout>
    );
}
