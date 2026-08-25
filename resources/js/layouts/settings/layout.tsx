import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LockKeyhole, Palette, UserRound } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        url: '/settings/profile',
        icon: UserRound,
    },
    {
        title: 'Password',
        url: '/settings/password',
        icon: LockKeyhole,
    },
    {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const currentPath = usePage().url.split('?')[0];

    return (
        <div className="px-4 py-6 md:px-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
                <aside className="w-full shrink-0 lg:w-56">
                    <div className="border-sidebar-border bg-sidebar text-sidebar-foreground rounded-xl border p-2 shadow-xs">
                        <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">Account</p>
                        <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Settings navigation">
                            {sidebarNavItems.map((item) => (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    prefetch
                                    className={cn(
                                        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-sidebar-ring flex h-9 min-w-fit items-center gap-2 rounded-md px-2.5 text-sm font-medium outline-hidden transition-colors focus-visible:ring-2',
                                        currentPath === item.url && 'bg-sidebar-accent text-sidebar-accent-foreground',
                                    )}
                                >
                                    {item.icon && <item.icon className="size-4" />}
                                    <span>{item.title}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="min-w-0 flex-1 lg:max-w-2xl">
                    <section className="space-y-8">{children}</section>
                </div>
            </div>
        </div>
    );
}
