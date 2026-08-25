import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { type BreadcrumbItem } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ children, title, breadcrumbs = [] }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="dark:bg-background min-w-0 bg-emerald-50/30">
                <AdminHeader title={title} breadcrumbs={breadcrumbs} />
                <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
