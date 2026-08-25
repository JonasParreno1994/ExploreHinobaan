import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, CalendarDays, FileText, LayoutDashboard, LogOut, Waves } from 'lucide-react';
import { ReactNode } from 'react';

const links = [
    ['Dashboard', 'partner.dashboard', LayoutDashboard],
    ['My Enterprises', 'partner.enterprises.index', Building2],
    ['Documents', 'partner.documents.index', FileText],
    ['Services & Facilities', 'partner.services.index', Building2],
    ['Reservations', 'partner.reservations.index', CalendarDays],
] as const;

export default function PartnerLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage<SharedData>().props;
    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5">
                    <Link href={route('partner.dashboard')} className="flex items-center gap-3 font-bold">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#F97316] text-white">
                            <Waves className="size-5" />
                        </span>
                        <span>Enterprise Partner Portal</span>
                    </Link>
                    <div className="flex items-center gap-2">
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
