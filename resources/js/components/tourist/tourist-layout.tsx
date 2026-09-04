import { SiteBrand } from '@/components/site-brand';
import { TouristNotificationDropdown } from '@/components/tourist/tourist-notification-dropdown';
import { Link } from '@inertiajs/react';
import { Bell, CalendarDays, LayoutDashboard, LogOut, ShieldCheck, UserRound } from 'lucide-react';

export function TouristLayout({ children }: { children: React.ReactNode }) {
    const links = [
        { href: '/tourist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tourist/reservations', label: 'My Reservations', icon: CalendarDays },
        { href: '/tourist/notifications', label: 'Notifications', icon: Bell },
        { href: '/tourist/profile', label: 'Profile', icon: UserRound },
        { href: '/tourist/verification', label: 'Verification', icon: ShieldCheck },
    ];
    return <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]"><header className="border-b border-orange-100 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4"><Link href="/"><SiteBrand subtitle="Tourist Account" /></Link><div className="flex items-center gap-2"><TouristNotificationDropdown /><Link href="/logout" method="post" as="button" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold"><LogOut className="size-4" /> Logout</Link></div></div></header><div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[240px_1fr]"><aside className="h-fit rounded-2xl border border-orange-100 bg-white p-3 shadow-sm"><nav className="grid gap-1">{links.map(({href,label,icon:Icon}) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-600 hover:bg-orange-50 hover:text-[#C2410C]"><Icon className="size-5" />{label}</Link>)}</nav></aside><main className="min-w-0">{children}</main></div></div>;
}
