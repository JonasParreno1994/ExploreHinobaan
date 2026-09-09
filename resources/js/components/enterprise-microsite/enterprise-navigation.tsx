import { EnterpriseMicrositeData, isAccommodation, isFoodBusiness, sectionOf } from '@/components/enterprise-microsite/types';

export function EnterpriseNavigation({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    const type = enterprise.enterprise_type.name;
    const links = [
        { label: 'Home', href: '#home', show: true },
        { label: 'About', href: '#about', show: Boolean(sectionOf(enterprise, 'about')?.content || enterprise.description) },
        { label: isAccommodation(type) ? 'Rooms' : 'Services', href: '#services', show: enterprise.services.length > 0 },
        { label: 'Menu', href: '#menu', show: isFoodBusiness(type) && enterprise.menu_categories.length > 0 },
        { label: 'Products', href: '#products', show: enterprise.local_products?.length > 0 },
        { label: 'Tours', href: '#tours', show: enterprise.tour_packages.length > 0 },
        { label: 'Specializations', href: '#specializations', show: enterprise.guide_specializations.length > 0 },
        { label: 'Amenities', href: '#amenities', show: Boolean(sectionOf(enterprise, 'amenities')?.content) },
        { label: 'Gallery', href: '#gallery', show: enterprise.gallery_images.length > 0 },
        { label: 'Location', href: '#location', show: true },
        { label: 'Reviews', href: '#reviews', show: true },
    ].filter((item) => item.show);
    const bookingLabel =
        type === 'Tour Guide' ? 'Book Guide' : isFoodBusiness(type) ? 'Reserve' : type === 'Local Product Seller' ? 'Order' : 'Book Now';
    const bookingHref = type === 'Local Product Seller'
        ? enterprise.local_products.length > 0 ? '#products' : '#contact'
        : ['Tour Guide', 'Tour Operator'].includes(type) && enterprise.tour_packages.length > 0
          ? '#tours'
          : isFoodBusiness(type) && enterprise.services.length === 0 && enterprise.menu_categories.length > 0
            ? '#menu'
            : enterprise.services.length > 0 ? '#services' : '#contact';
    return (
        <nav
            aria-label={`${enterprise.business_name} website`}
            className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 overflow-x-auto px-5 sm:px-8">
                <a href="#home" className="mr-3 shrink-0 font-black text-[var(--microsite-primary)]">
                    {enterprise.business_name}
                </a>
                {links.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="shrink-0 rounded-full px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-[var(--microsite-primary)]"
                    >
                        {item.label}
                    </a>
                ))}
                <a
                    href={bookingHref}
                    className="ml-auto shrink-0 rounded-full bg-[var(--microsite-primary)] px-4 py-2 text-sm font-extrabold text-white"
                >
                    {bookingLabel}
                </a>
            </div>
        </nav>
    );
}
