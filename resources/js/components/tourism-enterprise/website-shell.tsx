import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Link } from '@inertiajs/react';
import { BarChart3, BriefcaseBusiness, Eye, FileText, Home, Image, LayoutDashboard, MapPin, Palette, Search, Share2, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

export interface WebsiteEnterprise {
    id: number;
    slug: string;
    business_name: string;
    application_status: string;
    email: string;
    phone: string;
    website: string | null;
    address: string;
    latitude: string | null;
    longitude: string | null;
    enterprise_type?: { name: string };
    website_modules?: SpecializedModule[];
}

export interface EnterpriseWebsite {
    id: number;
    template: string;
    tagline: string | null;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    logo_url: string | null;
    cover_image_url: string | null;
    seo_title: string | null;
    seo_description: string | null;
    social_title: string | null;
    social_description: string | null;
    social_image_url: string | null;
    is_published: boolean;
    published_at: string | null;
}

const links = [
    ['Website Dashboard', 'partner.websites.dashboard', LayoutDashboard],
    ['Appearance', 'partner.websites.appearance', Palette],
    ['Home Page', 'partner.websites.home', Home],
    ['About Us', 'about', FileText],
    ['Gallery', 'partner.websites.gallery', Image],
    ['Amenities / Facilities', 'amenities', Sparkles],
    ['Location', 'partner.websites.location', MapPin],
    ['Contact & Social Media', 'partner.websites.contact', Share2],
    ['Policies', 'policies', FileText],
    ['SEO & Sharing', 'partner.websites.seo', Search],
    ['Analytics', 'partner.websites.analytics', BarChart3],
] as const;

type SpecializedModule = { key: string; label: string; destination: 'section' | 'menu' | 'tours' | 'guide' | 'services' | 'reservations' | 'products' | 'product-orders' };

function specializedModuleHref(enterprise: WebsiteEnterprise, module: SpecializedModule): string {
    const { key, destination } = module;
    if (destination === 'section') {
        return route('partner.websites.sections.edit', [enterprise.id, `module_${key}`]);
    }
    if (destination === 'menu') {
        return route('partner.websites.menu', enterprise.id);
    }
    if (destination === 'tours') {
        return route('partner.websites.tours', enterprise.id);
    }
    if (destination === 'guide') {
        return route('partner.websites.guide-specializations', enterprise.id);
    }

    const routeNames = {
        services: 'partner.services.index',
        reservations: 'partner.reservations.index',
        products: 'partner.products.index',
        'product-orders': 'partner.product-orders.index',
    } as const;

    return route(routeNames[destination], { enterprise: enterprise.id, module: key });
}

export function WebsiteShell({ enterprise, children }: { enterprise: WebsiteEnterprise; children: ReactNode }) {
    return (
        <PartnerLayout>
            <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
                <aside className="h-fit rounded-3xl border border-teal-100 bg-white p-3 shadow-sm">
                    <div className="px-3 py-3">
                        <p className="text-xs font-bold tracking-widest text-teal-700 uppercase">My Website</p>
                        <p className="mt-1 truncate text-sm font-extrabold">{enterprise.business_name}</p>
                    </div>
                    <nav className="grid gap-1">
                        {links.map(([label, destination, Icon]) => {
                            const href = destination.startsWith('partner.')
                                ? route(destination, enterprise.id)
                                : route('partner.websites.sections.edit', [enterprise.id, destination]);
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                                >
                                    <Icon className="size-4 shrink-0" /> {label}
                                </Link>
                            );
                        })}
                        {(enterprise.website_modules ?? []).length > 0 && (
                            <p className="px-3 pt-4 pb-1 text-[10px] font-bold tracking-widest text-orange-600 uppercase">Business Modules</p>
                        )}
                        {(enterprise.website_modules ?? []).map((module) => (
                            <Link
                                key={module.key}
                                href={specializedModuleHref(enterprise, module)}
                                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                            >
                                <BriefcaseBusiness className="size-4 shrink-0" /> {module.label}
                            </Link>
                        ))}
                        <Link
                            href={route('partner.websites.preview', enterprise.id)}
                            className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2.5 text-xs font-bold text-orange-700"
                        >
                            <Eye className="size-4" /> Preview Website
                        </Link>
                    </nav>
                </aside>
                <section className="min-w-0">{children}</section>
            </div>
        </PartnerLayout>
    );
}
