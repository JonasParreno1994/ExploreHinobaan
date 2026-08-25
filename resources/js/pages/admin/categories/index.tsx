import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { DataTable, type DataTableColumn } from '@/components/admin/data-table';
import { EmptyState } from '@/components/admin/empty-state';
import { PageHeader } from '@/components/admin/page-header';
import { Pagination, type LaravelPaginator } from '@/components/admin/pagination';
import { SearchInput } from '@/components/admin/search-input';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    Bed,
    CalendarDays,
    Droplets,
    Hotel,
    Mountain,
    Palmtree,
    Pencil,
    Plus,
    Power,
    ShoppingBag,
    Trees,
    Utensils,
    Waves,
} from 'lucide-react';
import { useState, type ComponentType } from 'react';

export interface TourismCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    status: 'active' | 'inactive';
}

interface CategoryPaginator extends LaravelPaginator {
    data: TourismCategory[];
    total: number;
}

const icons: Record<string, ComponentType<{ className?: string }>> = {
    Mountain,
    Waves,
    Palmtree,
    Droplets,
    Trees,
    Hotel,
    Bed,
    Utensils,
    Activity,
    CalendarDays,
    ShoppingBag,
};
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
];

export default function TourismCategoryIndex({ categories, filters }: { categories: CategoryPaginator; filters: { search: string } }) {
    const [search, setSearch] = useState(filters.search);
    const [selected, setSelected] = useState<TourismCategory | null>(null);
    const columns: DataTableColumn<TourismCategory>[] = [
        {
            header: 'Category',
            cell: (category) => {
                const Icon = category.icon ? icons[category.icon] : null;
                return (
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                            {Icon ? <Icon className="size-5" /> : <Activity className="size-5" />}
                        </span>
                        <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-muted-foreground text-xs">/{category.slug}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Description',
            className: 'max-w-md',
            cell: (category) => <span className="text-muted-foreground line-clamp-2">{category.description ?? 'No description'}</span>,
        },
        { header: 'Status', cell: (category) => <StatusBadge status={category.status} /> },
    ];

    function applySearch(value?: string): void {
        const query = (value ?? search).trim();
        router.get('/admin/categories', query ? { search: query } : {}, { preserveState: true, replace: true });
    }
    function clearSearch(): void {
        setSearch('');
        router.get('/admin/categories', {}, { preserveState: true, replace: true });
    }
    function changeStatus(): void {
        if (!selected) return;
        const action = selected.status === 'active' ? 'deactivate' : 'activate';
        router.patch(`/admin/categories/${selected.id}/${action}`, {}, { preserveScroll: true, onFinish: () => setSelected(null) });
    }

    return (
        <AdminLayout title="Tourism Categories" breadcrumbs={breadcrumbs}>
            <Head title="Tourism Categories" />
            <div className="grid gap-6">
                <PageHeader
                    title="Tourism Categories"
                    description="Manage reusable categories for destinations and tourism content."
                    actions={
                        <Button asChild className="bg-emerald-700">
                            <Link href={route('admin.categories.create')}>
                                <Plus />
                                Add category
                            </Link>
                        </Button>
                    }
                />
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="border-b p-4">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSearch={applySearch}
                                onClear={clearSearch}
                                placeholder="Search categories"
                            />
                        </div>
                        <DataTable
                            columns={columns}
                            rows={categories.data}
                            getRowKey={(category) => category.id}
                            emptyState={
                                <EmptyState
                                    title="No categories found"
                                    description="Try another search or add a tourism category."
                                    actionLabel="Add category"
                                    actionHref={route('admin.categories.create')}
                                />
                            }
                            actions={(category) => (
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={route('admin.categories.edit', category.id)} aria-label={`Edit ${category.name}`}>
                                            <Pencil />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelected(category)}
                                        aria-label={`${category.status === 'active' ? 'Deactivate' : 'Activate'} ${category.name}`}
                                    >
                                        <Power className={category.status === 'active' ? 'text-amber-600' : 'text-emerald-700'} />
                                    </Button>
                                </div>
                            )}
                        />
                        <Pagination pagination={categories} />
                    </CardContent>
                </Card>
            </div>
            <ConfirmDialog
                open={selected !== null}
                onOpenChange={(open) => !open && setSelected(null)}
                title={`${selected?.status === 'active' ? 'Deactivate' : 'Activate'} category?`}
                description={`${selected?.name ?? 'This category'} will be marked ${selected?.status === 'active' ? 'inactive' : 'active'}. Existing references will be preserved.`}
                confirmLabel={selected?.status === 'active' ? 'Deactivate' : 'Activate'}
                onConfirm={changeStatus}
            />
        </AdminLayout>
    );
}
