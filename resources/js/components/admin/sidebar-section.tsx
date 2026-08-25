import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { type LucideIcon } from 'lucide-react';

export interface AdminNavigationItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

interface SidebarSectionProps {
    label?: string;
    items: AdminNavigationItem[];
}

function isCurrentPath(currentUrl: string, itemHref: string): boolean {
    const currentPath = currentUrl.split('?')[0];

    return currentPath === itemHref || (itemHref !== '/dashboard' && currentPath.startsWith(`${itemHref}/`));
}

export function SidebarSection({ label, items }: SidebarSectionProps) {
    const { url } = usePage();

    return (
        <SidebarGroup className="py-1">
            {label && (
                <SidebarGroupLabel className="text-[0.65rem] font-semibold tracking-[0.14em] text-emerald-950/50 uppercase dark:text-emerald-100/50">
                    {label}
                </SidebarGroupLabel>
            )}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentPath(url, item.href)}
                            tooltip={item.title}
                            className="h-9 text-emerald-950/75 hover:bg-emerald-100/70 hover:text-emerald-950 data-[active=true]:bg-emerald-700 data-[active=true]:text-white dark:text-emerald-50/75 dark:hover:bg-emerald-900 dark:hover:text-white dark:data-[active=true]:bg-emerald-700"
                        >
                            <Link href={item.href} prefetch>
                                <item.icon />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
