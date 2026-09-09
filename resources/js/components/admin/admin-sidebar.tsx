import { SidebarSection, type AdminNavigationItem } from '@/components/admin/sidebar-section';
import { SiteBrand } from '@/components/site-brand';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Boxes,
    Building2,
    CalendarDays,
    ChartNoAxesCombined,
    GalleryHorizontalEnd,
    Heart,
    House,
    Images,
    LayoutDashboard,
    Map,
    MapPin,
    Megaphone,
    ScrollText,
    Settings,
    ShieldAlert,
    ShieldCheck,
    ShoppingBasket,
    Sparkles,
    Star,
    Tags,
    Type,
    UserRoundCheck,
    Users,
} from 'lucide-react';

interface NavigationSection {
    label?: string;
    items: AdminNavigationItem[];
}

const navigationSections: NavigationSection[] = [
    { items: [{ title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] },
    {
        label: 'Tourism Management',
        items: [
            { title: 'Destinations', href: '/admin/destinations', icon: MapPin },
            { title: 'Categories', href: '/admin/categories', icon: Tags },
            { title: 'Events & Festivals', href: '/admin/events', icon: CalendarDays },
            { title: 'Local Products', href: '/admin/local-products', icon: ShoppingBasket },
        ],
    },
    {
        label: 'Enterprise Management',
        items: [
            { title: 'Enterprises', href: '/admin/enterprises', icon: Building2 },
            { title: 'Enterprise Types', href: '/admin/enterprise-types', icon: Building2 },
        ],
    },
    {
        label: 'Tourist Management',
        items: [
            { title: 'Tourists', href: '/admin/tourists', icon: Users },
            { title: 'Tourist Verifications', href: '/admin/tourist-verifications', icon: ShieldCheck },
            { title: 'Tourist Arrivals', href: '/admin/tourist-arrivals', icon: ChartNoAxesCombined },
            { title: 'Reviews', href: '/admin/reviews', icon: Star },
            { title: 'Wishlists', href: '/admin/wishlists', icon: Heart },
        ],
    },
    {
        label: 'Reports & Analytics',
        items: [
            { title: 'Tourism Analytics', href: '/admin/tourism-analytics', icon: ChartNoAxesCombined },
            { title: 'Generate Reports', href: '/admin/reports', icon: ScrollText },
        ],
    },
    {
        label: 'Content Management',
        items: [
            { title: 'Homepage', href: '/admin/homepage', icon: House },
            { title: 'Banners', href: '/admin/banners', icon: Images },
            { title: 'Text', href: '/admin/text', icon: Type },
            { title: 'Gallery', href: '/admin/gallery', icon: GalleryHorizontalEnd },
            { title: 'Announcements', href: '/admin/announcements', icon: Megaphone },
            { title: 'Why Visit', href: '/admin/why-visit', icon: Sparkles },
            { title: 'LGU Information', href: '/admin/lgu-information', icon: Map },
        ],
    },
    {
        label: 'System',
        items: [
            { title: 'Barangays', href: '/admin/barangays', icon: Boxes },
            { title: 'Users', href: '/admin/users', icon: UserRoundCheck },
            { title: 'Roles', href: '/admin/roles', icon: ShieldCheck },
            { title: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
            { title: 'Security Monitoring', href: '/admin/security-monitoring', icon: ShieldAlert },
            { title: 'Settings', href: '/admin/settings', icon: Settings },
        ],
    },
];

export function AdminSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdministrator = auth.user.role?.name === 'Administrator';
    const visibleSections = navigationSections
        .map((section) => ({
            ...section,
            items: section.items.filter(
                (item) =>
                    !['/admin/users', '/admin/roles', '/admin/audit-logs', '/admin/security-monitoring', '/admin/settings'].includes(item.href) ||
                    isAdministrator,
            ),
        }))
        .filter((section) => section.items.length > 0);

    return (
        <Sidebar collapsible="icon" className="border-emerald-950/10" variant="sidebar">
            <SidebarHeader className="border-b border-emerald-950/10 p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg" tooltip="Explore Hinoba-an">
                            <Link href="/dashboard" prefetch>
                                <SiteBrand subtitle="Tourism Administration" compact />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="dark:to-sidebar gap-0 bg-linear-to-b from-emerald-50/60 to-white dark:from-emerald-950/20">
                {visibleSections.map((section) => (
                    <SidebarSection key={section.label ?? 'dashboard'} {...section} />
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
