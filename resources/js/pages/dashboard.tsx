import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard" breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <section className="dark:bg-card rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight text-emerald-950 sm:text-2xl dark:text-emerald-50">
                    Welcome to Explore Hinoba-an Admin Dashboard
                </h2>
            </section>
        </AdminLayout>
    );
}
