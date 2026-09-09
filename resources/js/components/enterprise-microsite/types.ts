export interface MicrositeSection {
    section_type: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    is_visible?: boolean;
    sort_order?: number;
    settings?: { featured_ids?: number[] } | null;
}
export interface EnterpriseService {
    id: number;
    slug: string;
    name: string;
    short_description: string | null;
    price: string;
    pricing_unit: string;
    capacity: number | null;
    quantity: number;
    amenities: string[] | null;
    main_image_url: string | null;
    reservation_required: boolean;
    service_type: { name: string } | null;
}
export interface EnterpriseMicrositeData {
    id: number;
    slug: string;
    business_name: string;
    description: string | null;
    address: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    latitude: string | null;
    longitude: string | null;
    cover_image_url: string | null;
    logo_url: string | null;
    enterprise_type: { name: string };
    barangay: { name: string } | null;
    services: EnterpriseService[];
    gallery_images: { id: number; image_url: string; caption: string | null }[];
    microsite: {
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
    } | null;
    sections: MicrositeSection[];
    social_links: { id: number; platform: string; url: string }[];
    menu_categories: {
        id: number;
        name: string;
        description: string | null;
        items: {
            id: number;
            name: string;
            description: string | null;
            price: string;
            image_url: string | null;
            is_featured: boolean;
            is_best_seller: boolean;
            is_new: boolean;
        }[];
    }[];
    tour_packages: {
        id: number;
        name: string;
        description: string | null;
        rate: string;
        inclusions: string | null;
        exclusions: string | null;
        image_url: string | null;
        itineraries: { id: number; time: string | null; activity: string; destination: string | null; description: string | null }[];
    }[];
    guide_specializations: { id: number; name: string; description: string | null; years_experience: number | null }[];
    local_products: {
        id: number;
        slug: string;
        name: string;
        short_description: string | null;
        price: string;
        selling_unit: string;
        stock_quantity: number;
        main_image_url: string | null;
        is_featured: boolean;
        category: { name: string } | null;
    }[];
}

export function sectionOf(enterprise: EnterpriseMicrositeData, type: string): MicrositeSection | undefined {
    return enterprise.sections.find((section) => section.section_type === type);
}
export function isAccommodation(type: string): boolean {
    return ['Resort', 'Hotel', 'Homestay'].includes(type);
}
export function isFoodBusiness(type: string): boolean {
    return ['Cafe', 'Restaurant'].includes(type);
}
