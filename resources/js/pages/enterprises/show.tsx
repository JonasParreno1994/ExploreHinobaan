import { EnterpriseFooter } from '@/components/enterprise-microsite/enterprise-footer';
import { EnterpriseGallery } from '@/components/enterprise-microsite/enterprise-gallery';
import { EnterpriseHero } from '@/components/enterprise-microsite/enterprise-hero';
import { EnterpriseNavigation } from '@/components/enterprise-microsite/enterprise-navigation';
import {
    AccommodationSection,
    EnterpriseAbout,
    EnterpriseAmenities,
    EnterpriseContact,
    EnterpriseCTA,
    EnterpriseMap,
    EnterprisePolicies,
    EnterpriseReviews,
    EnterpriseServices,
    GuideProfileSection,
    MenuSection,
    ProductSection,
    RecreationSection,
    SpecializedContentSections,
    TourPackagesSection,
} from '@/components/enterprise-microsite/enterprise-sections';
import { EnterpriseMicrositeData, isAccommodation, sectionOf } from '@/components/enterprise-microsite/types';
import { type PublicReview, type ReviewSummary } from '@/components/reviews/review-section';
import { SiteBrand } from '@/components/site-brand';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { CSSProperties, Fragment, ReactNode, useEffect } from 'react';

const templateBackgrounds: Record<string, string> = {
    tropical: 'bg-[#FFFBF5]',
    coastal: 'bg-sky-50',
    modern: 'bg-slate-50',
    elegant: 'bg-stone-50',
    nature: 'bg-emerald-50',
    minimal: 'bg-white',
    local_heritage: 'bg-amber-50',
};

export default function Show({
    enterprise,
    reviews,
    reviewSummary,
    isPreview = false,
}: {
    enterprise: EnterpriseMicrositeData;
    reviews: PublicReview[];
    reviewSummary: ReviewSummary;
    isPreview?: boolean;
}) {
    const microsite = enterprise.microsite;
    const socialTitle = microsite?.social_title || microsite?.seo_title || enterprise.business_name;
    const socialDescription = microsite?.social_description || microsite?.seo_description || microsite?.tagline || enterprise.description;
    const type = enterprise.enterprise_type.name;
    const colors = {
        '--microsite-primary': microsite?.primary_color ?? '#0F766E',
        '--microsite-secondary': microsite?.secondary_color ?? '#F97316',
        '--microsite-accent': microsite?.accent_color ?? '#FBBF24',
    } as CSSProperties;
    const serviceSection = isAccommodation(type) ? <AccommodationSection enterprise={enterprise} /> : type === 'Recreation Provider' ? <RecreationSection enterprise={enterprise} /> : <EnterpriseServices enterprise={enterprise} />;
    const sectionComponents: Record<string, ReactNode> = {
        about: <EnterpriseAbout enterprise={enterprise} />, menu: <MenuSection enterprise={enterprise} />,
        rooms: serviceSection, activities: serviceSection, featured_services: serviceSection,
        amenities: <EnterpriseAmenities enterprise={enterprise} />, products: <ProductSection enterprise={enterprise} />,
        tour_packages: <><TourPackagesSection enterprise={enterprise} /><GuideProfileSection enterprise={enterprise} /></>,
        gallery: <EnterpriseGallery enterprise={enterprise} />, location: <EnterpriseMap enterprise={enterprise} />,
        contact: <EnterpriseContact enterprise={enterprise} />, reviews: <EnterpriseReviews enterprise={enterprise} reviews={reviews} summary={reviewSummary} />,
    };
    const specializedKey = type === 'Local Product Seller' ? 'products'
        : type === 'Recreation Provider' ? 'activities'
        : isAccommodation(type) ? 'rooms'
        : ['Tour Guide', 'Tour Operator'].includes(type) ? 'tour_packages'
        : ['Cafe', 'Restaurant'].includes(type) ? 'menu'
        : 'featured_services';
    const defaultHomepageBlocks = ['about', specializedKey, 'amenities', 'gallery', 'location', 'contact', 'reviews']
        .map((key) => ({ key, node: sectionComponents[key] }))
        .filter((block) => block.node);
    const builderSections = enterprise.sections.filter((section) => section.section_type.startsWith('builder_'));
    const heroSection = builderSections.find((section) => section.section_type === 'builder_hero');
    const homepageBlocks = builderSections.length > 0
        ? builderSections.filter((section) => section.section_type !== 'builder_hero' && section.is_visible !== false).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((section) => ({ key: section.section_type, node: sectionComponents[section.section_type.replace('builder_', '')] })).filter((block) => block.node)
        : defaultHomepageBlocks;
    useEffect(() => {
        if (isPreview) return;
        const send = (payload: Record<string, unknown>) => {
            const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
            void fetch(route('enterprises.website-events.store', enterprise.slug), {
                method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token ?? '' },
                body: JSON.stringify(payload),
            });
        };
        const track = (event: MouseEvent) => {
            const anchor = (event.target as HTMLElement).closest('a');
            if (!anchor) return;
            const href = anchor.href;
            const text = anchor.textContent?.trim() ?? '';
            const eventType = href.includes('google.com/maps') ? 'direction_click'
                : href.startsWith('mailto:') || href.startsWith('tel:') ? 'contact_click'
                : enterprise.social_links.some((link) => href === link.url) ? 'social_click'
                : /reserve|book|order/i.test(text) ? 'reservation_click'
                : href.includes('/services/') ? 'content_view' : null;
            if (!eventType) return;
            send({ event_type: eventType, target_type: eventType === 'social_click' ? 'social' : undefined, target_label: text });
        };
        const viewed = new Set<Element>();
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
            if (!entry.isIntersecting || viewed.has(entry.target)) return;
            viewed.add(entry.target);
            const element = entry.target as HTMLElement;
            send({ event_type: 'content_view', target_type: element.dataset.analyticsContent, target_id: Number(element.dataset.analyticsId), target_label: element.dataset.analyticsLabel });
        }), { threshold: 0.6 });
        document.querySelectorAll('[data-analytics-content]').forEach((element) => observer.observe(element));
        document.addEventListener('click', track);
        return () => { document.removeEventListener('click', track); observer.disconnect(); };
    }, [enterprise.slug, enterprise.social_links, isPreview]);
    return (
        <div
            className={`min-h-screen scroll-smooth text-slate-900 ${templateBackgrounds[microsite?.template ?? 'tropical']}`}
            style={colors}
            data-template={microsite?.template ?? 'tropical'}
        >
            <Head title={microsite?.seo_title || enterprise.business_name}>
                {microsite?.seo_description && <meta head-key="description" name="description" content={microsite.seo_description} />}
                <meta head-key="og:type" property="og:type" content="website" />
                <meta head-key="og:title" property="og:title" content={socialTitle} />
                {socialDescription && <meta head-key="og:description" property="og:description" content={socialDescription} />}
                <meta head-key="og:url" property="og:url" content={route('enterprises.show', enterprise.slug)} />
                {microsite?.social_image_url && <meta head-key="og:image" property="og:image" content={microsite.social_image_url} />}
                <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
                <meta head-key="twitter:title" name="twitter:title" content={socialTitle} />
                {socialDescription && <meta head-key="twitter:description" name="twitter:description" content={socialDescription} />}
                {microsite?.social_image_url && <meta head-key="twitter:image" name="twitter:image" content={microsite.social_image_url} />}
            </Head>
            {isPreview && (
                <div className="bg-amber-300 px-4 py-2 text-center text-sm font-black text-amber-950">
                    Preview mode · Draft changes are visible only to you
                </div>
            )}
            <header className="absolute inset-x-0 z-30 border-b border-white/15 text-white">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
                    <Link
                        href={route('home')}
                        aria-label="Explore Hinoba-an home"
                        className="rounded-2xl bg-white/90 px-3 py-2 text-slate-900 shadow-sm backdrop-blur"
                    >
                        <SiteBrand subtitle="Official Tourism Portal" compact />
                    </Link>
                    <Link
                        href={route('enterprises.index')}
                        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/10 px-4 py-2 text-sm font-bold backdrop-blur"
                    >
                        <ArrowLeft className="size-4" /> Explore Hinoba-an
                    </Link>
                </div>
            </header>
            {heroSection?.is_visible !== false && <EnterpriseHero enterprise={enterprise} />}
            <EnterpriseNavigation enterprise={enterprise} />
            <main className="mx-auto max-w-7xl px-5 sm:px-8">
                {homepageBlocks.map((block) => <Fragment key={block.key}>{block.node}</Fragment>)}
                <EnterprisePolicies section={sectionOf(enterprise, 'policies')} />
                <SpecializedContentSections enterprise={enterprise} />
                <EnterpriseCTA enterprise={enterprise} />
            </main>
            <EnterpriseFooter enterprise={enterprise} />
        </div>
    );
}
