import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, PanelBottom, PanelTop, Plus, Settings2 } from 'lucide-react';

interface SiteSetting {
    id: number;
    name: string;
    status: 'active' | 'inactive';
}

interface HeaderSetting extends SiteSetting {
    site_name: string;
    tagline: string;
    logo_url: string | null;
    social_image_url: string | null;
}

interface FooterSetting extends SiteSetting {
    description: string;
    email: string;
    phone: string;
}

export default function SettingsIndex({
    headerSetting,
    footerSetting,
}: {
    headerSetting: HeaderSetting | null;
    footerSetting: FooterSetting | null;
}) {
    return (
        <AdminLayout
            title="Site Settings"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Settings', href: '/admin/settings' },
            ]}
        >
            <Head title="Site Settings" />
            <div className="space-y-6">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950 dark:text-emerald-50">
                        <Settings2 className="size-6 text-emerald-700" /> Site Settings
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Edit the public header and footer displayed on the tourism landing page.</p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-3">
                                    <span className="rounded-xl bg-orange-50 p-3 text-orange-600">
                                        <PanelTop />
                                    </span>
                                    <div>
                                        <CardTitle>Header Settings</CardTitle>
                                        <CardDescription className="mt-1">Website identity and account button labels.</CardDescription>
                                    </div>
                                </div>
                                {headerSetting && <StatusBadge status={headerSetting.status} />}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {headerSetting ? (
                                <div className="rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/40">
                                    <div className="flex items-center gap-3">
                                        {headerSetting.logo_url && (
                                            <img src={headerSetting.logo_url} alt="" className="size-12 rounded-lg bg-white object-contain p-1" />
                                        )}
                                        <p className="font-semibold">{headerSetting.site_name}</p>
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-sm">{headerSetting.tagline}</p>
                                    <p className="text-muted-foreground mt-3 text-xs">Configuration: {headerSetting.name}</p>
                                    {headerSetting.social_image_url && (
                                        <div className="mt-4 overflow-hidden rounded-lg border bg-white">
                                            <img
                                                src={headerSetting.social_image_url}
                                                alt="Social media preview"
                                                className="aspect-[1200/630] w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">No header configuration has been created yet.</p>
                            )}
                            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                                <Link
                                    href={
                                        headerSetting ? route('admin.header-settings.edit', headerSetting.id) : route('admin.header-settings.create')
                                    }
                                >
                                    {headerSetting ? (
                                        'Edit header'
                                    ) : (
                                        <>
                                            <Plus /> Create header
                                        </>
                                    )}
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-3">
                                    <span className="rounded-xl bg-teal-50 p-3 text-teal-700">
                                        <PanelBottom />
                                    </span>
                                    <div>
                                        <CardTitle>Footer Settings</CardTitle>
                                        <CardDescription className="mt-1">Contact details, social links, and copyright.</CardDescription>
                                    </div>
                                </div>
                                {footerSetting && <StatusBadge status={footerSetting.status} />}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {footerSetting ? (
                                <div className="rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/40">
                                    <p className="font-semibold">{footerSetting.name}</p>
                                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{footerSetting.description}</p>
                                    <p className="text-muted-foreground mt-3 text-xs">
                                        {footerSetting.email} · {footerSetting.phone}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">No footer configuration has been created yet.</p>
                            )}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <Button asChild className="bg-teal-700 hover:bg-teal-800">
                                    <Link
                                        href={
                                            footerSetting
                                                ? route('admin.footer-settings.edit', footerSetting.id)
                                                : route('admin.footer-settings.create')
                                        }
                                    >
                                        {footerSetting ? (
                                            'Edit footer'
                                        ) : (
                                            <>
                                                <Plus /> Create footer
                                            </>
                                        )}
                                        <ArrowRight />
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.footer-settings.index')}>Manage all footers</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
