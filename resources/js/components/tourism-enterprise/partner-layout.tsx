import { SiteBrand } from '@/components/site-brand';
import { PartnerNotificationDropdown } from '@/components/tourism-enterprise/partner-notification-dropdown';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, CalendarCheck, CalendarDays, FileText, LayoutDashboard, LogOut, Package, ShoppingBag, Users } from 'lucide-react';
import { ReactNode } from 'react';

const commonLinks = [
    ['Dashboard', 'partner.dashboard', LayoutDashboard],
    ['My Enterprises', 'partner.enterprises.index', Building2],
    ['Documents', 'partner.documents.index', FileText],
] as const;

const tourismServiceLinks = [
    ['Services & Facilities', 'partner.services.index', Building2],
    ['Reservations', 'partner.reservations.index', CalendarDays],
] as const;

const productLinks = [
    ['Local Products', 'partner.products.index', Package],
    ['Product Orders', 'partner.product-orders.index', ShoppingBag],
] as const;

export default function PartnerLayout({ children }: { children: ReactNode }) {
    const { auth, partnerWorkspace } = usePage<SharedData>().props;
    const arrivalLinks = partnerWorkspace?.can_report_arrivals
        ? ([
              ['Tourist Arrivals', 'partner.tourist-arrivals.index', Users],
              ['Daily Tourist Reports', 'partner.daily-reports.index', CalendarCheck],
          ] as const)
        : [];
    const links = [
        ...commonLinks,
        ...(partnerWorkspace?.is_local_product_producer ? [] : tourismServiceLinks),
        ...arrivalLinks,
        ...(partnerWorkspace?.is_local_product_producer ? productLinks : []),
    ];
    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5">
                    <Link href={route('partner.dashboard')} className="flex items-center gap-3 font-bold">
                        <SiteBrand subtitle="Enterprise Partner Portal" compact />
                    </Link>
                    <div className="flex items-center gap-2">
                        <PartnerNotificationDropdown />
                        <span className="hidden text-sm font-semibold sm:block">{auth.user.name}</span>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('logout')} method="post" as="button">
                                <LogOut />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
            <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 lg:grid-cols-[240px_1fr]">
                <aside className="h-fit rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
                    <p className="px-3 pb-3 text-[10px] font-bold tracking-widest text-[#64748B] uppercase">Partner workspace</p>
                    {links.map(([label, name, Icon]) => (
                        <Link
                            key={name}
                            href={route(name)}
                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                        >
                            <Icon className="size-5" />
                            {label}
                        </Link>
                    ))}
                    <div className="mt-4 rounded-2xl bg-teal-50 p-4 text-xs leading-5 text-[#0F766E]">
                        <FileText className="mb-2 size-5" />
                        Only your enterprise records are available in this workspace.
                    </div>
                </aside>
                <main className="min-w-0">{children}</main>
            </div>
        </div>
    );
}
