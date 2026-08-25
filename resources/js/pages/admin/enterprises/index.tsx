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
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Eye, FileText, MapPin } from 'lucide-react';
import { useCallback, useState } from 'react';

interface NamedOption {
    id: number;
    name: string;
}

export interface Enterprise {
    id: number;
    user_id: number | null;
    enterprise_type_id: number;
    barangay_id: number;
    business_name: string;
    slug: string;
    contact_person: string;
    email: string;
    phone: string;
    description: string | null;
    address: string;
    latitude: string | null;
    longitude: string | null;
    website: string | null;
    logo: string | null;
    logo_url: string | null;
    cover_image: string | null;
    cover_image_url: string | null;
    license_number: string | null;
    application_status: 'pending' | 'approved' | 'rejected' | 'suspended';
    approved_at: string | null;
    approved_by: number | null;
    rejection_reason: string | null;
    documents_count?: number;
    enterprise_type: NamedOption;
    barangay: NamedOption;
    user?: (NamedOption & { email: string; phone: string | null }) | null;
    approver?: NamedOption | null;
    documents?: EnterpriseDocument[];
}

export interface EnterpriseDocument {
    id: number;
    enterprise_id: number;
    document_type: string;
    document_number: string | null;
    file_path: string;
    file_url: string;
    expiration_date: string | null;
    verification_status: 'pending' | 'verified' | 'rejected';
    remarks: string | null;
}

interface EnterprisePaginator extends LaravelPaginator {
    data: Enterprise[];
    total: number;
}
interface Counts {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Enterprises', href: '/admin/enterprises' },
];
const tabs = [
    { value: '', key: 'all', label: 'All' },
    { value: 'pending', key: 'pending', label: 'Pending' },
    { value: 'approved', key: 'approved', label: 'Approved' },
    { value: 'rejected', key: 'rejected', label: 'Rejected' },
    { value: 'suspended', key: 'suspended', label: 'Suspended' },
] as const;

export default function EnterpriseIndex({
    enterprises,
    filters,
    counts,
}: {
    enterprises: EnterprisePaginator;
    filters: { status: string; search: string };
    counts: Counts;
}) {
    const [search, setSearch] = useState(filters.search);
    const visit = useCallback(
        (nextSearch: string) => {
            const query = Object.fromEntries(Object.entries({ search: nextSearch, status: filters.status }).filter(([, value]) => value));
            router.get('/admin/enterprises', query, { preserveState: true, replace: true });
        },
        [filters.status],
    );
    const columns: DataTableColumn<Enterprise>[] = [
        {
            header: 'Enterprise',
            cell: (item) => (
                <div className="flex min-w-56 items-center gap-3">
                    {item.logo_url ? (
                        <img src={item.logo_url} alt="" className="size-12 rounded-lg object-cover" />
                    ) : (
                        <span className="bg-muted flex size-12 items-center justify-center rounded-lg">
                            <Building2 className="text-muted-foreground" />
                        </span>
                    )}
                    <div>
                        <p className="font-semibold">{item.business_name}</p>
                        <p className="text-muted-foreground text-xs">{item.enterprise_type.name}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Contact',
            cell: (item) => (
                <div>
                    <p>{item.contact_person}</p>
                    <p className="text-muted-foreground text-xs">{item.email}</p>
                </div>
            ),
        },
        {
            header: 'Location',
            cell: (item) => (
                <div className="flex min-w-44 gap-2">
                    <MapPin className="text-muted-foreground size-4 shrink-0" />
                    <div>
                        <p>{item.barangay.name}</p>
                        <p className="text-muted-foreground line-clamp-1 text-xs">{item.address}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Documents',
            cell: (item) => (
                <Badge variant="outline">
                    <FileText />
                    {item.documents_count ?? 0}
                </Badge>
            ),
        },
        { header: 'Status', cell: (item) => <StatusBadge status={item.application_status} /> },
    ];
    return (
        <AdminLayout title="Tourism Enterprises" breadcrumbs={breadcrumbs}>
            <Head title="Tourism Enterprises" />
            <PageHeader title="Tourism Enterprise Management" description="Review applications, documents, approvals, and suspended enterprises." />
            <Card>
                <div className="overflow-x-auto border-b px-4">
                    <nav className="flex min-w-max gap-1" aria-label="Application status">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.key}
                                href={route('admin.enterprises.index', { status: tab.value || undefined, search: filters.search || undefined })}
                                className={cn(
                                    'border-b-2 px-4 py-3 text-sm font-medium',
                                    filters.status === tab.value
                                        ? 'border-emerald-700 text-emerald-700'
                                        : 'text-muted-foreground hover:text-foreground border-transparent',
                                )}
                            >
                                {tab.label}
                                <Badge variant="secondary" className="ml-2">
                                    {counts[tab.key]}
                                </Badge>
                            </Link>
                        ))}
                    </nav>
                </div>
                <CardContent className="p-5">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSearch={(value) => visit(value ?? search)}
                        onClear={() => {
                            setSearch('');
                            visit('');
                        }}
                        placeholder="Search business, contact, email, or license"
                    />
                </CardContent>
                <DataTable
                    columns={columns}
                    rows={enterprises.data}
                    emptyState={
                        <EmptyState
                            icon={<Building2 className="size-6" />}
                            title="No enterprises found"
                            description="No applications match this status or search."
                        />
                    }
                    actions={(item) => (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.enterprises.show', item.id)}>
                                <Eye />
                                Review
                            </Link>
                        </Button>
                    )}
                />
                <Pagination
                    currentPage={enterprises.current_page}
                    lastPage={enterprises.last_page}
                    previousUrl={enterprises.prev_page_url}
                    nextUrl={enterprises.next_page_url}
                />
            </Card>
        </AdminLayout>
    );
}
