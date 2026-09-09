import { EnterpriseMicrositeData, isAccommodation, isFoodBusiness } from '@/components/enterprise-microsite/types';
import { BadgeCheck, Mail, MapPin, Navigation } from 'lucide-react';

function primaryAction(enterprise: EnterpriseMicrositeData): { label: string; href: string } {
    const type = enterprise.enterprise_type.name;
    if (type === 'Local Product Seller') return { label: 'View Products', href: '#products' };
    if (isFoodBusiness(type))
        return {
            label: enterprise.menu_categories.length ? 'View Menu' : 'Reserve',
            href: enterprise.menu_categories.length ? '#menu' : '#services',
        };
    if (isAccommodation(type)) return { label: enterprise.services.length ? 'View Rooms' : 'Book Now', href: '#services' };
    if (['Tour Guide', 'Tour Operator'].includes(type))
        return { label: enterprise.tour_packages.length ? 'View Tours' : 'Book Now', href: enterprise.tour_packages.length ? '#tours' : '#services' };
    return { label: 'Reserve', href: '#services' };
}

export function directionsUrl(enterprise: EnterpriseMicrositeData): string {
    const destination = enterprise.latitude && enterprise.longitude ? `${enterprise.latitude},${enterprise.longitude}` : enterprise.address;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function EnterpriseHero({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    const action = primaryAction(enterprise);
    const logo = enterprise.microsite?.logo_url ?? enterprise.logo_url;
    return (
        <section id="home" className="relative min-h-[620px] overflow-hidden bg-slate-950 text-white sm:min-h-[680px]">
            <img
                src={enterprise.microsite?.cover_image_url ?? enterprise.cover_image_url ?? '/images/landing/hinobaan-hero.png'}
                alt={enterprise.business_name}
                className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/25" />
            <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-end px-5 py-16 sm:min-h-[680px] sm:px-8 lg:py-24">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-4">
                        {logo && (
                            <img
                                src={logo}
                                alt={`${enterprise.business_name} logo`}
                                className="size-20 rounded-2xl border-2 border-white/80 bg-white object-cover shadow-2xl sm:size-24"
                            />
                        )}
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">
                                {enterprise.enterprise_type.name}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-bold">
                                <BadgeCheck className="size-4" /> Verified by the Municipal Tourism Office of Hinoba-an
                            </span>
                        </div>
                    </div>
                    <h1 className="mt-6 text-4xl leading-tight font-black tracking-tight sm:text-6xl lg:text-7xl">{enterprise.business_name}</h1>
                    <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                        {enterprise.microsite?.tagline || 'Discover an authentic Hinoba-an tourism experience.'}
                    </p>
                    <p className="mt-5 flex items-start gap-2 text-sm font-semibold text-white/80">
                        <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--microsite-accent)]" />{' '}
                        {enterprise.address || `Barangay ${enterprise.barangay?.name ?? 'Hinoba-an'}, Hinoba-an`}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href={action.href}
                            className="rounded-full bg-[var(--microsite-secondary)] px-6 py-3.5 text-sm font-extrabold shadow-lg transition hover:-translate-y-0.5"
                        >
                            {action.label}
                        </a>
                        <a
                            href={directionsUrl(enterprise)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold backdrop-blur hover:bg-white/20"
                        >
                            <Navigation className="size-4" /> Get Directions
                        </a>
                        {enterprise.email && (
                            <a
                                href={`mailto:${enterprise.email}`}
                                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold backdrop-blur hover:bg-white/20"
                            >
                                <Mail className="size-4" /> Contact
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
