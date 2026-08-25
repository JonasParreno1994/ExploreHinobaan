import { DataTable, type DataTableColumn } from '@/components/admin/data-table';
import { type DestinationImage } from '@/components/admin/destination-gallery-manager';
import { EmptyState } from '@/components/admin/empty-state';
import { FilterSelect } from '@/components/admin/filter-select';
import { PageHeader } from '@/components/admin/page-header';
import { Pagination, type LaravelPaginator } from '@/components/admin/pagination';
import { SearchInput } from '@/components/admin/search-input';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Image as ImageIcon, Pencil, Plus, Star } from 'lucide-react';
import { useState } from 'react';

interface NamedOption {
    id: number;
    name: string;
}
export interface Destination {
    id: number;
    category_id: number;
    barangay_id: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    address: string;
    latitude: string | null;
    longitude: string | null;
    entrance_fee: string | null;
    opening_time: string | null;
    closing_time: string | null;
    contact_number: string | null;
    email: string | null;
    website: string | null;
    featured_image: string | null;
    featured_image_url: string | null;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    views: number;
    created_by: number | null;
    category: NamedOption;
    barangay: NamedOption;
    creator?: { id: number; name: string } | null;
    images?: DestinationImage[];
}
interface DestinationPaginator extends LaravelPaginator {
    data: Destination[];
    total: number;
}
interface Filters {
    search: string;
    category: string;
    barangay: string;
    status: string;
}
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Destinations', href: '/admin/destinations' },
];

export default function DestinationIndex({
    destinations,
    categories,
    barangays,
    filters,
}: {
    destinations: DestinationPaginator;
    categories: NamedOption[];
    barangays: NamedOption[];
    filters: Filters;
}) {
    const [search, setSearch] = useState(filters.search);
    const [category, setCategory] = useState(filters.category || 'all');
    const [barangay, setBarangay] = useState(filters.barangay || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    function visit(next: Partial<{ search: string; category: string; barangay: string; status: string }>): void {
        const values = { search, category, barangay, status, ...next };
        const query = Object.fromEntries(Object.entries(values).filter(([, value]) => value && value !== 'all'));
        router.get('/admin/destinations', query, { preserveState: true, replace: true });
    }
    const columns: DataTableColumn<Destination>[] = [
        {
            header: 'Destination',
            cell: (item) => (
                <div className="flex min-w-56 items-center gap-3">
                    {item.featured_image_url ? (
                        <img src={item.featured_image_url} alt="" className="size-14 rounded-lg object-cover" />
                    ) : (
                        <span className="bg-muted flex size-14 items-center justify-center rounded-lg">
                            <ImageIcon className="text-muted-foreground" />
                        </span>
                    )}
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-xs">{item.barangay.name}</p>
                    </div>
                </div>
            ),
        },
        { header: 'Category', cell: (item) => item.category.name },
        { header: 'Status', cell: (item) => <StatusBadge status={item.status} /> },
        {
            header: 'Featured',
            cell: (item) =>
                item.is_featured ? <Star className="size-5 fill-amber-400 text-amber-500" /> : <span className="text-muted-foreground">No</span>,
        },
        { header: 'Views', cell: (item) => item.views.toLocaleString() },
    ];

    return (
        <AdminLayout title="Destinations" breadcrumbs={breadcrumbs}>
            <Head title="Destinations" />
            <div className="grid gap-6">
                <PageHeader
                    title="Tourism Destinations"
                    description="Manage destination information, publishing, and image galleries."
                    actions={
                        <Button asChild className="bg-emerald-700">
                            <Link href={route('admin.destinations.create')}>
                                <Plus />
                                Add destination
                            </Link>
                        </Button>
                    }
                />
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="grid gap-3 border-b p-4 lg:grid-cols-[minmax(260px,1fr)_repeat(3,minmax(160px,auto))]">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSearch={(value) => visit({ search: value ?? '' })}
                                onClear={() => {
                                    setSearch('');
                                    visit({ search: '' });
                                }}
                                placeholder="Search name or address"
                            />
                            <FilterSelect
                                value={category}
                                onChange={(value) => {
                                    setCategory(value);
                                    visit({ category: value });
                                }}
                                options={[
                                    { value: 'all', label: 'All categories' },
                                    ...categories.map((item) => ({ value: String(item.id), label: item.name })),
                                ]}
                            />
                            <FilterSelect
                                value={barangay}
                                onChange={(value) => {
                                    setBarangay(value);
                                    visit({ barangay: value });
                                }}
                                options={[
                                    { value: 'all', label: 'All barangays' },
                                    ...barangays.map((item) => ({ value: String(item.id), label: item.name })),
                                ]}
                            />
                            <FilterSelect
                                value={status}
                                onChange={(value) => {
                                    setStatus(value);
                                    visit({ status: value });
                                }}
                                options={[
                                    { value: 'all', label: 'All statuses' },
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'published', label: 'Published' },
                                    { value: 'archived', label: 'Archived' },
                                ]}
                            />
                        </div>
                        <DataTable
                            columns={columns}
                            rows={destinations.data}
                            getRowKey={(item) => item.id}
                            emptyState={
                                <EmptyState
                                    title="No destinations found"
                                    description="Adjust the filters or add a destination."
                                    actionLabel="Add destination"
                                    actionHref={route('admin.destinations.create')}
                                />
                            }
                            actions={(item) => (
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={route('admin.destinations.show', item.id)} aria-label={`View ${item.name}`}>
                                            <Eye />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={route('admin.destinations.edit', item.id)} aria-label={`Edit ${item.name}`}>
                                            <Pencil />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        />
                        <Pagination pagination={destinations} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
