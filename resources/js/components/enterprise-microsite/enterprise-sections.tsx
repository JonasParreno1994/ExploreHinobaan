import { SectionHeading } from '@/components/enterprise-microsite/enterprise-gallery';
import { directionsUrl } from '@/components/enterprise-microsite/enterprise-hero';
import { EnterpriseMicrositeData, EnterpriseService, MicrositeSection, sectionOf } from '@/components/enterprise-microsite/types';
import DestinationMap from '@/components/landing/destination-map';
import { ReviewSection, type PublicReview, type ReviewSummary } from '@/components/reviews/review-section';
import { Link } from '@inertiajs/react';
import { BadgeCheck, Globe, Mail, MapPin, Navigation, Phone, ShoppingBag } from 'lucide-react';
import { ReactNode } from 'react';

export function EnterpriseAbout({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    const about = sectionOf(enterprise, 'about');
    const content = about?.content || sectionOf(enterprise, 'home')?.content || enterprise.description;
    if (!content) return null;
    return (
        <section id="about" className="scroll-mt-24 py-20 sm:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr]">
                <SectionHeading
                    eyebrow="Our story"
                    title={about?.title || `Welcome to ${enterprise.business_name}`}
                    description={about?.subtitle ?? undefined}
                />
                <p className="text-lg leading-9 whitespace-pre-line text-slate-600">{content}</p>
            </div>
        </section>
    );
}

function ServiceCards({ enterprise, title, eyebrow }: { enterprise: EnterpriseMicrositeData; title: string; eyebrow: string }) {
    return (
        <section id="services" className="scroll-mt-24 py-20 sm:py-24">
            <SectionHeading
                eyebrow={eyebrow}
                title={title}
                description="Choose an experience and view availability, details, and reservation options."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enterprise.services.map((service) => (
                    <ServiceCard key={service.id} enterprise={enterprise} service={service} />
                ))}
            </div>
        </section>
    );
}
function ServiceCard({ enterprise, service }: { enterprise: EnterpriseMicrositeData; service: EnterpriseService }) {
    return (
        <article data-analytics-content="service" data-analytics-id={service.id} data-analytics-label={service.name} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={service.main_image_url ?? enterprise.cover_image_url ?? '/images/landing/hinobaan-hero.png'}
                    loading="lazy"
                    decoding="async"
                    alt={service.name}
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[var(--microsite-primary)] backdrop-blur">
                    {service.service_type?.name}
                </span>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-black">{service.name}</h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">{service.short_description}</p>
                <div className="mt-5 flex items-end justify-between gap-3">
                    <p>
                        <strong className="text-xl text-[var(--microsite-secondary)]">₱{Number(service.price).toLocaleString('en-PH')}</strong>
                        <small className="block text-slate-500">per {service.pricing_unit.replace('per_', '')}</small>
                    </p>
                    <Link
                        href={route('enterprises.services.show', [enterprise.slug, service.slug])}
                        className="rounded-full bg-[var(--microsite-primary)] px-4 py-2.5 text-sm font-extrabold text-white"
                    >
                        {service.reservation_required ? 'Reserve' : 'View'}
                    </Link>
                </div>
            </div>
        </article>
    );
}
export function EnterpriseServices({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    return enterprise.services.length ? (
        <ServiceCards enterprise={enterprise} title="Services & Experiences" eyebrow="Make your visit memorable" />
    ) : null;
}
export function AccommodationSection({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    return enterprise.services.length ? <ServiceCards enterprise={enterprise} title="Stay With Us" eyebrow="Rooms & accommodation" /> : null;
}
export function RecreationSection({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    return enterprise.services.length ? <ServiceCards enterprise={enterprise} title="Activities & Packages" eyebrow="Adventure starts here" /> : null;
}

export function EnterpriseAmenities({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    const amenities = sectionOf(enterprise, 'amenities');
    if (!amenities?.content) return null;
    const items = amenities.content
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
    return (
        <section id="amenities" className="scroll-mt-24 rounded-[2.5rem] bg-[var(--microsite-primary)] px-6 py-14 text-white sm:px-10">
            <SectionHeading
                eyebrow="Comfort & convenience"
                title={amenities.title || 'Amenities & Facilities'}
                description={amenities.subtitle ?? undefined}
                inverted
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-semibold backdrop-blur">
                        <BadgeCheck className="size-5 shrink-0 text-[var(--microsite-accent)]" /> {item}
                    </div>
                ))}
            </div>
        </section>
    );
}

export function MenuSection({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    if (!enterprise.menu_categories.length) return null;
    return (
        <section id="menu" className="scroll-mt-24 py-20 sm:py-24">
            <SectionHeading eyebrow="Made for you" title="Explore Our Menu" description="Fresh favorites, specialties, and local flavors." />
            <div className="mt-10 grid gap-10">
                {enterprise.menu_categories.map((category) => (
                    <div key={category.id}>
                        <div className="border-b border-slate-200 pb-3">
                            <h3 className="text-2xl font-black">{category.name}</h3>
                            {category.description && <p className="mt-1 text-sm text-slate-500">{category.description}</p>}
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            {category.items.map((item) => (
                                <article key={item.id} data-analytics-content="menu" data-analytics-id={item.id} data-analytics-label={item.name} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                                    {item.image_url && (
                                        <img src={item.image_url} alt={item.name} className="size-24 shrink-0 rounded-2xl object-cover" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between gap-3">
                                            <h4 className="font-black">{item.name}</h4>
                                            <strong className="text-[var(--microsite-primary)]">₱{Number(item.price).toLocaleString('en-PH')}</strong>
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</p>
                                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-black text-[var(--microsite-secondary)]">
                                            {item.is_featured && <span>FEATURED</span>}
                                            {item.is_best_seller && <span>BEST SELLER</span>}
                                            {item.is_new && <span>NEW</span>}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function ProductSection({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    if (!enterprise.local_products?.length) return null;
    return (
        <section id="products" className="scroll-mt-24 py-20 sm:py-24">
            <SectionHeading
                eyebrow="Made in Hinoba-an"
                title="Local Products"
                description="Shop locally made products directly from this verified seller."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {enterprise.local_products.map((product) => (
                    <Link
                        key={product.id}
                        href={route('local-products.show', product.slug)}
                        data-analytics-content="product" data-analytics-id={product.id} data-analytics-label={product.name}
                        className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100"
                    >
                        <div className="relative h-52 overflow-hidden">
                            {product.main_image_url && (
                                <img
                                    src={product.main_image_url}
                                    alt={product.name}
                                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                                />
                            )}
                            {product.is_featured && (
                                <span className="absolute top-3 left-3 rounded-full bg-[var(--microsite-accent)] px-3 py-1 text-xs font-black">
                                    Featured
                                </span>
                            )}
                        </div>
                        <div className="p-5">
                            <small className="font-bold text-slate-500">{product.category?.name}</small>
                            <h3 className="mt-1 font-black">{product.name}</h3>
                            <p className="mt-3 font-black text-[var(--microsite-primary)]">
                                ₱{Number(product.price).toLocaleString('en-PH')} / {product.selling_unit}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export function TourPackagesSection({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    if (!enterprise.tour_packages.length) return null;
    return (
        <section id="tours" className="scroll-mt-24 py-20 sm:py-24">
            <SectionHeading
                eyebrow="Curated journeys"
                title="Tour Packages"
                description="Thoughtfully planned experiences led by local tourism professionals."
            />
            <div className="mt-10 grid gap-7">
                {enterprise.tour_packages.map((tour) => (
                    <article key={tour.id} data-analytics-content="tour" data-analytics-id={tour.id} data-analytics-label={tour.name} className="overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-slate-100">
                        <div className="grid lg:grid-cols-[.75fr_1.25fr]">
                            {tour.image_url && <img src={tour.image_url} alt={tour.name} className="h-full min-h-72 w-full object-cover" />}
                            <div className="p-7 sm:p-9">
                                <div className="flex flex-wrap justify-between gap-3">
                                    <h3 className="text-2xl font-black">{tour.name}</h3>
                                    <strong className="text-xl text-[var(--microsite-primary)]">₱{Number(tour.rate).toLocaleString('en-PH')}</strong>
                                </div>
                                <p className="mt-3 leading-7 text-slate-600">{tour.description}</p>
                                {tour.itineraries.length > 0 && (
                                    <ol className="mt-6 grid gap-3 border-l-2 border-[var(--microsite-accent)] pl-5">
                                        {tour.itineraries.map((step) => (
                                            <li key={step.id} className="relative">
                                                <span className="absolute top-1.5 -left-[1.72rem] size-3 rounded-full bg-[var(--microsite-secondary)]" />
                                                <p className="text-sm font-black">
                                                    {step.time?.slice(0, 5)} {step.activity}
                                                </p>
                                                {step.destination && <small className="text-slate-500">{step.destination}</small>}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export function GuideProfileSection({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    if (!enterprise.guide_specializations.length && !sectionOf(enterprise, 'module_guide_profile')?.content) return null;
    const profile = sectionOf(enterprise, 'module_guide_profile');
    return (
        <section id="specializations" className="scroll-mt-24 py-20 sm:py-24">
            <SectionHeading eyebrow="Your local expert" title={profile?.title || 'Guide Profile'} description={profile?.content ?? undefined} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {enterprise.guide_specializations.map((item) => (
                    <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6">
                        <BadgeCheck className="size-7 text-[var(--microsite-primary)]" />
                        <h3 className="mt-4 text-lg font-black">{item.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                        {item.years_experience !== null && (
                            <p className="mt-3 text-xs font-black text-[var(--microsite-secondary)]">{item.years_experience} years experience</p>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}

export function EnterpriseMap({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    return (
        <section id="location" className="scroll-mt-24 py-20 sm:py-24">
            <div className="grid items-start gap-8 lg:grid-cols-[.6fr_1.4fr]">
                <div>
                    <SectionHeading eyebrow="Find us" title="Location" />
                    <p className="mt-5 flex gap-3 leading-7 text-slate-600">
                        <MapPin className="mt-1 size-5 shrink-0 text-[var(--microsite-secondary)]" /> {enterprise.address}
                    </p>
                    <a
                        href={directionsUrl(enterprise)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--microsite-primary)] px-5 py-3 text-sm font-black text-white"
                    >
                        <Navigation className="size-4" /> Get Directions
                    </a>
                </div>
                <DestinationMap
                    name={enterprise.business_name}
                    address={enterprise.address}
                    latitude={enterprise.latitude}
                    longitude={enterprise.longitude}
                />
            </div>
        </section>
    );
}

export function EnterpriseContact({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    return (
        <section id="contact" className="rounded-[2.5rem] bg-slate-950 px-6 py-14 text-white sm:px-10">
            <SectionHeading
                eyebrow="Plan your visit"
                title="Contact Us"
                description="Reach the enterprise directly for questions, availability, and arrangements."
                inverted
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <ContactLink
                    icon={<Phone />}
                    label="Phone"
                    value={enterprise.phone}
                    href={enterprise.phone ? `tel:${enterprise.phone}` : undefined}
                />
                <ContactLink
                    icon={<Mail />}
                    label="Email"
                    value={enterprise.email}
                    href={enterprise.email ? `mailto:${enterprise.email}` : undefined}
                />
                <ContactLink icon={<Globe />} label="Website" value={enterprise.website} href={enterprise.website ?? undefined} />
            </div>
            {enterprise.social_links.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-2">
                    {enterprise.social_links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold capitalize hover:bg-white/10"
                        >
                            {link.platform}
                        </a>
                    ))}
                </div>
            )}
        </section>
    );
}
function ContactLink({ icon, label, value, href }: { icon: ReactNode; label: string; value: string | null; href?: string }) {
    const body = (
        <>
            <span className="text-[var(--microsite-accent)]">{icon}</span>
            <span>
                <small className="block text-white/55">{label}</small>
                {value || 'Not available'}
            </span>
        </>
    );
    return href ? (
        <a href={href} target={label === 'Website' ? '_blank' : undefined} rel="noreferrer" className="flex gap-3 rounded-2xl bg-white/5 p-4">
            {body}
        </a>
    ) : (
        <div className="flex gap-3 rounded-2xl bg-white/5 p-4">{body}</div>
    );
}

export function EnterprisePolicies({ section }: { section?: MicrositeSection }) {
    return section?.content ? (
        <section id="policies" className="scroll-mt-24 py-20 sm:py-24">
            <SectionHeading eyebrow="Before you visit" title={section.title || 'Policies'} description={section.subtitle ?? undefined} />
            <p className="mt-7 max-w-4xl leading-8 whitespace-pre-line text-slate-600">{section.content}</p>
        </section>
    ) : null;
}
export function EnterpriseReviews({
    enterprise,
    reviews,
    summary,
}: {
    enterprise: EnterpriseMicrositeData;
    reviews: PublicReview[];
    summary: ReviewSummary;
}) {
    return (
        <div id="reviews" className="scroll-mt-24 py-20 sm:py-24">
            <ReviewSection targetType="enterprise" targetId={enterprise.id} reviews={reviews} summary={summary} />
        </div>
    );
}
export function EnterpriseCTA({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    return (
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[var(--microsite-secondary)] px-6 py-14 text-center text-white sm:px-10">
            <ShoppingBag className="mx-auto size-10" />
            <h2 className="mt-5 text-3xl font-black sm:text-4xl">Ready to experience {enterprise.business_name}?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
                Connect directly with this verified Hinoba-an tourism enterprise and start planning your visit.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
                {enterprise.phone && (
                    <a href={`tel:${enterprise.phone}`} className="rounded-full bg-white px-6 py-3 font-black text-[var(--microsite-secondary)]">
                        Call Now
                    </a>
                )}
                <a
                    href={directionsUrl(enterprise)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/50 px-6 py-3 font-black"
                >
                    Get Directions
                </a>
            </div>
        </section>
    );
}

export function SpecializedContentSections({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    const sections = enterprise.sections.filter(
        (item) => item.section_type.startsWith('module_') && item.content && item.section_type !== 'module_guide_profile',
    );
    return (
        <>
            {sections.map((section) => (
                <section key={section.section_type} className="py-12">
                    <SectionHeading eyebrow="More information" title={section.title || 'Details'} description={section.subtitle ?? undefined} />
                    <p className="mt-6 max-w-4xl leading-8 whitespace-pre-line text-slate-600">{section.content}</p>
                </section>
            ))}
        </>
    );
}
