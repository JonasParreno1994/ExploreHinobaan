import { AdminBreadcrumbs } from '@/components/admin/admin-breadcrumbs';
import { NotificationDropdown } from '@/components/admin/notification-dropdown';
import { UserDropdown } from '@/components/admin/user-dropdown';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AdminHeaderProps {
    title: string;
    breadcrumbs: BreadcrumbItem[];
}

export function AdminHeader({ title, breadcrumbs }: AdminHeaderProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-30 border-b border-emerald-950/10 backdrop-blur">
            <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-5" />
                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-base font-semibold text-emerald-950 sm:text-lg dark:text-emerald-50">{title}</h1>
                    <div className="hidden sm:block">
                        <AdminBreadcrumbs items={breadcrumbs} />
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <NotificationDropdown />
                    <UserDropdown user={auth.user} />
                </div>
            </div>
        </header>
    );
}
