import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { router, usePage, usePoll } from '@inertiajs/react';
import { Bell, CalendarDays, CheckCheck, ShoppingBag } from 'lucide-react';

export function PartnerNotificationDropdown() {
    const { partnerNotifications } = usePage<SharedData>().props;
    const unreadCount = partnerNotifications?.unread_count ?? 0;
    const notifications = partnerNotifications?.items ?? [];

    usePoll(15_000, { only: ['partnerNotifications'] });

    const openNotification = (notification: (typeof notifications)[number]) => {
        if (notification.is_read) {
            router.visit(notification.data.url);
            return;
        }

        router.patch(
            route('partner.notifications.read', notification.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.visit(notification.data.url),
            },
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full"
                    aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[#F97316] px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(24rem,calc(100vw-2rem))] p-0">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={() => router.patch(route('partner.notifications.read-all'))}
                            className="flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:text-[#F97316]"
                        >
                            <CheckCheck className="size-4" /> Mark all read
                        </button>
                    )}
                </div>
                <DropdownMenuSeparator className="m-0" />
                <div className="max-h-96 overflow-y-auto p-1">
                    {notifications.map((notification) => {
                        const Icon = notification.data.activity_type === 'product_order' ? ShoppingBag : CalendarDays;

                        return (
                            <DropdownMenuItem
                                key={notification.id}
                                onSelect={(event) => {
                                    event.preventDefault();
                                    openNotification(notification);
                                }}
                                className={`items-start gap-3 rounded-xl p-3 ${notification.is_read ? 'bg-white' : 'bg-orange-50'}`}
                            >
                                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#F97316] shadow-sm">
                                    <Icon className="size-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-bold text-[#1F2937]">{notification.data.title}</span>
                                    <span className="mt-0.5 block text-xs leading-5 text-[#64748B]">{notification.data.message}</span>
                                    <span className="mt-1 block text-[11px] font-semibold text-[#0F766E]">
                                        {notification.data.reference} · {notification.created_at}
                                    </span>
                                </span>
                                {!notification.is_read && <span className="mt-2 size-2 shrink-0 rounded-full bg-[#F97316]" />}
                            </DropdownMenuItem>
                        );
                    })}
                    {notifications.length === 0 && <p className="px-4 py-10 text-center text-sm text-[#64748B]">No notifications yet.</p>}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
