import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type SharedData } from '@/types';
import { router, usePage, usePoll } from '@inertiajs/react';
import { Bell, Building2, CheckCheck } from 'lucide-react';

export function NotificationDropdown() {
    const notifications = usePage<SharedData>().props.adminNotifications?.items ?? [];
    const unreadCount = usePage<SharedData>().props.adminNotifications?.unread_count ?? 0;
    usePoll(15_000, { only: ['adminNotifications'] });

    const open = (notification: (typeof notifications)[number]) => {
        if (notification.is_read) return router.visit(notification.data.url);
        router.patch(route('admin.notifications.read', notification.id), {}, { onSuccess: () => router.visit(notification.data.url) });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
                    <Bell className="size-5" />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-3 py-2"><DropdownMenuLabel>Notifications</DropdownMenuLabel>{unreadCount > 0 && <button onClick={() => router.patch(route('admin.notifications.read-all'))} className="flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCheck className="size-4" /> Mark all read</button>}</div>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto p-1">
                    {notifications.map((notification) => <DropdownMenuItem key={notification.id} onSelect={(event) => { event.preventDefault(); open(notification); }} className={`items-start gap-3 rounded-lg p-3 ${notification.is_read ? '' : 'bg-orange-50'}`}>
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-orange-600 shadow-sm"><Building2 className="size-4" /></span>
                        <span className="min-w-0 flex-1"><strong className="block text-sm">{notification.data.title}</strong><span className="mt-1 block text-xs text-muted-foreground">{notification.data.message}</span><span className="mt-1 block text-[11px] font-semibold text-emerald-700">{notification.data.reference} · {notification.created_at}</span></span>
                        {!notification.is_read && <span className="mt-2 size-2 rounded-full bg-orange-600" />}
                    </DropdownMenuItem>)}
                    {notifications.length === 0 && <div className="text-muted-foreground px-3 py-8 text-center text-sm">You have no new notifications.</div>}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
