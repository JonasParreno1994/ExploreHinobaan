import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { Link, router, usePage, usePoll } from '@inertiajs/react';
import { Bell, CalendarDays, CheckCheck, CreditCard, Package, ShieldCheck } from 'lucide-react';

export function TouristNotificationDropdown() {
    const feed = usePage<SharedData>().props.touristNotifications;
    const unread = feed?.unread_count ?? 0;
    const items = feed?.items ?? [];
    usePoll(15_000, { only: ['touristNotifications'] });

    const open = (item: (typeof items)[number]) => {
        if (item.is_read) return router.visit(item.data.url);
        router.patch(route('tourist.notifications.read', item.id), {}, { preserveScroll: true, onSuccess: () => router.visit(item.data.url) });
    };

    return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Notifications, ${unread} unread`}><Bell className="size-5" />{unread > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-orange-600 px-1 text-[10px] font-extrabold text-white ring-2 ring-white">{unread > 99 ? '99+' : unread}</span>}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-[min(24rem,calc(100vw-2rem))] p-0"><div className="flex items-center justify-between px-4 py-3"><DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>{unread > 0 && <button onClick={() => router.patch(route('tourist.notifications.read-all'))} className="flex items-center gap-1 text-xs font-bold text-teal-700"><CheckCheck className="size-4" /> Mark all read</button>}</div><DropdownMenuSeparator className="m-0" /><div className="max-h-96 overflow-y-auto p-1">{items.map(item => { const Icon = item.data.activity_type === 'product_order' ? Package : item.data.activity_type === 'verification' ? ShieldCheck : item.data.activity_type === 'payment' ? CreditCard : CalendarDays; return <DropdownMenuItem key={item.id} onSelect={event => { event.preventDefault(); open(item); }} className={`items-start gap-3 rounded-xl p-3 ${item.is_read ? '' : 'bg-orange-50'}`}><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-orange-600 shadow-sm"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><strong className="block text-sm">{item.data.title}</strong><span className="block text-xs leading-5 text-slate-500">{item.data.message}</span><span className="text-[11px] font-semibold text-teal-700">{item.data.reference} · {item.created_at}</span></span>{!item.is_read && <span className="mt-2 size-2 rounded-full bg-orange-600" />}</DropdownMenuItem>; })}{items.length === 0 && <p className="px-4 py-10 text-center text-sm text-slate-500">No notifications yet.</p>}</div><DropdownMenuSeparator className="m-0" /><Link href="/tourist/notifications" className="block px-4 py-3 text-center text-sm font-bold text-teal-700">View all notifications</Link></DropdownMenuContent></DropdownMenu>;
}
