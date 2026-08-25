import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, PanelBottom, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface FooterSetting {
    id: number;
    name: string;
    description: string;
    municipality: string;
    office: string;
    address: string;
    email: string;
    phone: string;
    facebook_url: string | null;
    instagram_url: string | null;
    youtube_url: string | null;
    copyright_text: string;
    status: 'active' | 'inactive';
}
interface Paginator {
    data: FooterSetting[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}
export default function FooterSettingIndex({ footerSettings }: { footerSettings: Paginator }) {
    const [selected, setSelected] = useState<FooterSetting | null>(null);
    function remove() {
        if (selected) router.delete(route('admin.footer-settings.destroy', selected.id), { onFinish: () => setSelected(null) });
    }
    return (
        <AdminLayout
            title="Footer Management"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Footer', href: '/admin/footer-settings' },
            ]}
        >
            <Head title="Footer Management" />
            <Card>
                <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <PanelBottom className="text-emerald-700" />
                            Footer configurations
                        </CardTitle>
                        <CardDescription>
                            Manage the contact details, social links, and public description shown in the landing-page footer.
                        </CardDescription>
                    </div>
                    <Button asChild className="bg-emerald-700">
                        <Link href={route('admin.footer-settings.create')}>
                            <Plus />
                            Add footer
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {footerSettings.data.length ? (
                        <div className="divide-y">
                            {footerSettings.data.map((setting) => (
                                <article key={setting.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{setting.name}</h3>
                                            <StatusBadge status={setting.status} />
                                        </div>
                                        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{setting.description}</p>
                                        <p className="text-muted-foreground mt-2 text-xs">
                                            {setting.office} · {setting.email} · {setting.phone}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.footer-settings.show', setting.id)}>
                                                <Eye />
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.footer-settings.edit', setting.id)}>
                                                <Pencil />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600" onClick={() => setSelected(setting)}>
                                            <Trash2 />
                                            Delete
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground py-16 text-center">No footer configuration yet.</div>
                    )}
                    <Pagination
                        currentPage={footerSettings.current_page}
                        lastPage={footerSettings.last_page}
                        previousUrl={footerSettings.prev_page_url}
                        nextUrl={footerSettings.next_page_url}
                    />
                </CardContent>
            </Card>
            <ConfirmDialog
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
                title="Delete footer configuration?"
                description={`${selected?.name ?? 'This configuration'} will be permanently deleted.`}
                confirmLabel="Delete footer"
                onConfirm={remove}
            />
        </AdminLayout>
    );
}
