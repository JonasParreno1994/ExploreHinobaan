import TourismMap, { type MapLocation } from '@/components/landing/tourism-map';
import { SiteBrand } from '@/components/site-brand';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Camera,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Compass,
    Facebook,
    Fish,
    Heart,
    Instagram,
    MapPin,
    Menu,
    Mountain,
    Search,
    Shell,
    Sparkles,
    Store,
    Trees,
    Umbrella,
    Utensils,
    Waves,
    X,
    Youtube,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface HeroSlide {
    id: string;
    image: string;
}
interface HeroText {
    header_1: string | null;
    header_2: string | null;
    header_3: string | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    destinations_count: number;
}
interface Destination {
    id: number;
    name: string;
    slug: string;
    description: string;
    address: string;
    image: string | null;
    category: string | null;
    barangay: string | null;
    views: number;
}
interface Accommodation {
    id: number;
    name: string;
    slug: string;
    description: string;
    address: string;
    image: string | null;
    type: string | null;
    barangay: string | null;
}
interface TourismEvent {
    id: number;
    title: string;
    type: string;
    description: string;
    venue: string;
    date: string | null;
    day: string | null;
    month: string | null;
    image: string | null;
}
interface TourismEnterprise {
    id: number;
    business_name: string;
    slug: string;
    description: string | null;
    cover_image_url: string | null;
    logo_url: string | null;
    enterprise_type: { name: string } | null;
    barangay: { name: string } | null;
    services: { id: number; name: string; price: string; pricing_unit: string }[];
}
interface LocalProduct {
    id: number;
    name: string;
    slug: string;
    price: string;
    selling_unit: string;
    main_image_url: string | null;
    stock_quantity: number;
    enterprise: { business_name: string };
    category: { name: string };
}
interface Statistics {
    destinations: number;
    enterprises: number;
    accommodations: number;
    barangays: number;
}
interface FooterSetting {
    description: string;
    municipality: string;
    office: string;
    address: string;
    email: string;
    phone: string;
    facebook_url: string | null;
    instagram_url: string | null;
    youtube_url: string | null;
    copyright_text: string;
}
interface HeaderSetting {
    logo_url: string | null;
    site_name: string;
    tagline: string;
    login_label: string;
    register_label: string;
}
interface WhyVisitSection {
    eyebrow: string;
    title: string;
    subtitle: string | null;
    cards: { title: string; description: string; icon: string }[];
}
interface WelcomeProps {
    heroSlides: HeroSlide[];
    heroText: HeroText | null;
    categories: Category[];
    destinations: Destination[];
    accommodations: Accommodation[];
    events: TourismEvent[];
    enterprises: TourismEnterprise[];
    localProducts: LocalProduct[];
    mapLocations: MapLocation[];
    statistics: Statistics;
    footerSetting: FooterSetting | null;
    headerSetting: HeaderSetting | null;
    whyVisitSection: WhyVisitSection | null;
}

const heroImage = '/images/landing/hinobaan-hero.png';
const navItems = [
    ['Home', '#home'],
    ['Destinations', '#destinations'],
    ['About Hinoba-an', '#why-visit'],
    ['Contact', '#contact'],
];
const exploreNavItems = [
    ['Things to Do', '#things-to-do'],
    ['Accommodations', '#accommodations'],
    ['Events', '#events'],
    ['Tourism Enterprises', '#enterprises'],
];
const categoryFallbacks = ['Beaches', 'Resorts', 'Islands', 'Waterfalls', 'Mountains', 'Food & Dining', 'Cultural Attractions', 'Outdoor Activities'];
const categoryIcons = [Waves, Umbrella, Shell, Fish, Mountain, Utensils, Sparkles, Compass];
const activities = [
    ['Beach Adventure', Waves, 'right center'],
    ['Island Exploration', Shell, 'center'],
    ['Hiking', Mountain, 'left center'],
    ['Food Trips', Utensils, 'right center'],
    ['Camping', Trees, 'left center'],
    ['Nature Photography', Camera, 'center'],
];
const reasonFallbacks = [
    { title: 'Natural Wonders', icon: 'trees', description: 'Discover pristine beaches, caves, forests, mountains, and waterfalls.' },
    { title: 'Local Culture', icon: 'sparkles', description: 'Experience local traditions, festivals, cuisine, and heartfelt hospitality.' },
    { title: 'Adventure', icon: 'compass', description: 'Enjoy swimming, hiking, island exploration, snorkeling, and outdoor activities.' },
    { title: 'Peaceful Escape', icon: 'umbrella', description: 'Slow down in relaxing destinations away from crowded tourist areas.' },
];
const reasonIcons = {
    trees: Trees,
    sparkles: Sparkles,
    compass: Compass,
    umbrella: Umbrella,
    waves: Waves,
    mountain: Mountain,
    heart: Heart,
    camera: Camera,
};

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
    return (
        <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold tracking-[.22em] text-[#F97316] uppercase">{eyebrow}</p>
            <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl">{title}</h2>
            <p className="mt-4 leading-7 text-[#64748B]">{description}</p>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="col-span-full rounded-3xl border border-dashed border-orange-200 bg-[#FFF3E6] px-6 py-14 text-center">
            <Sparkles className="mx-auto size-8 text-[#F97316]" />
            <p className="mt-3 font-semibold text-[#1F2937]">{label} will be featured here soon.</p>
            <p className="mt-1 text-sm text-[#64748B]">The Tourism Office is preparing verified listings for visitors.</p>
        </div>
    );
}

export default function Welcome({
    heroSlides,
    heroText,
    categories,
    destinations,
    accommodations,
    events,
    enterprises,
    localProducts,
    mapLocations,
    statistics,
    footerSetting,
    headerSetting,
    whyVisitSection,
}: WelcomeProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeHeroSlide, setActiveHeroSlide] = useState(0);
    const slides = heroSlides.length > 0 ? heroSlides : [{ id: 'fallback', image: heroImage }];
    const displayedReasons = whyVisitSection?.cards?.length ? whyVisitSection.cards : reasonFallbacks;

    useEffect(() => {
        if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveHeroSlide((current) => (current + 1) % slides.length);
        }, 6000);

        return () => window.clearInterval(interval);
    }, [slides.length]);
    const shownCategories = categoryFallbacks.map(
        (name, index) =>
            categories.find((category) => category.name.toLowerCase() === name.toLowerCase()) ?? {
                id: -index - 1,
                name,
                slug: name.toLowerCase().replaceAll(' ', '-'),
                icon: null,
                destinations_count: 0,
            },
    );

    function submitSearch(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <Head title="Explore Hinoba-an — Interactive Tourism Portal">
                <meta
                    name="description"
                    content="Discover destinations, accommodations, events, and local experiences in Hinoba-an, Negros Occidental."
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=dm-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>
            <div className="min-h-screen [scroll-behavior:smooth] bg-[#FFFBF5] text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <header className="fixed inset-x-0 top-0 z-[1000] border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur-xl">
                    <nav className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 lg:px-6" aria-label="Primary navigation">
                        <a href="#home" className="flex shrink-0 items-center gap-2.5">
                            <SiteBrand compact />
                        </a>
                        <div className="hidden items-center gap-4 xl:flex">
                            {navItems.slice(0, 2).map(([label, href], index) => (
                                <a
                                    key={label}
                                    href={href}
                                    className={`text-[13px] font-semibold transition hover:text-[#F97316] ${index === 0 ? 'text-[#F97316]' : 'text-[#1F2937]'}`}
                                >
                                    {label}
                                </a>
                            ))}
                            <Link
                                href={route('local-products.index')}
                                className="text-[13px] font-semibold text-[#1F2937] transition hover:text-[#F97316]"
                            >
                                Local Products
                            </Link>
                            <div className="group relative">
                                <button
                                    type="button"
                                    className="flex items-center gap-1 text-[13px] font-semibold text-[#1F2937] transition hover:text-[#F97316]"
                                >
                                    Explore <ChevronDown className="size-3.5 transition group-hover:rotate-180" />
                                </button>
                                <div className="invisible absolute top-full left-1/2 w-56 -translate-x-1/2 pt-4 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                                    <div className="grid gap-1 rounded-2xl border border-orange-100 bg-white p-2 shadow-xl">
                                        {exploreNavItems.map(([label, href]) => (
                                            <a
                                                key={label}
                                                href={href}
                                                className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-orange-50 hover:text-[#F97316]"
                                            >
                                                {label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {navItems.slice(2).map(([label, href]) => (
                                <a key={label} href={href} className="text-[13px] font-semibold text-[#1F2937] transition hover:text-[#F97316]">
                                    {label}
                                </a>
                            ))}
                        </div>
                        <div className="hidden items-center gap-2 lg:flex">
                            <Link
                                href={route('interactive-map')}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#0F766E] px-3 py-2.5 text-sm font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white"
                            >
                                <MapPin className="size-4" />
                                Interactive Map
                            </Link>
                            <Link
                                href={route('partner.login')}
                                className="rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C2410C]"
                            >
                                {headerSetting?.register_label ?? 'Be a Partner'}
                            </Link>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="rounded-xl p-2.5 text-[#1F2937] hover:bg-orange-50 xl:hidden"
                            aria-label="Toggle navigation"
                        >
                            {menuOpen ? <X /> : <Menu />}
                        </button>
                    </nav>
                    {menuOpen && (
                        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t bg-white p-4 xl:hidden">
                            <div className="grid gap-1">
                                {navItems.map(([label, href]) => (
                                    <a
                                        key={label}
                                        href={href}
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-orange-50 hover:text-[#F97316]"
                                    >
                                        {label}
                                    </a>
                                ))}
                                <Link
                                    href={route('local-products.index')}
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-orange-50 hover:text-[#F97316]"
                                >
                                    Local Products
                                </Link>
                                <div className="mt-2 rounded-2xl bg-[#FFF3E6] p-2">
                                    <p className="px-3 py-2 text-xs font-bold tracking-wider text-[#0F766E] uppercase">Explore</p>
                                    {exploreNavItems.map(([label, href]) => (
                                        <a
                                            key={label}
                                            href={href}
                                            onClick={() => setMenuOpen(false)}
                                            className="block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white hover:text-[#F97316]"
                                        >
                                            {label}
                                        </a>
                                    ))}
                                </div>
                                <Link
                                    href={route('interactive-map')}
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-bold text-white"
                                >
                                    <MapPin className="size-4" />
                                    Interactive Map
                                </Link>
                                <Link
                                    href={route('partner.login')}
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-2 rounded-xl bg-[#F97316] px-4 py-3 text-center text-sm font-bold text-white"
                                >
                                    {headerSetting?.register_label ?? 'Be a Partner'}
                                </Link>
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    <section id="home" className="relative flex min-h-[820px] items-center overflow-hidden pt-18 text-white">
                        {slides.map((slide, index) => (
                            <img
                                key={slide.id}
                                src={slide.image}
                                alt="Tourism attraction in Hinoba-an"
                                aria-hidden={index !== activeHeroSlide}
                                className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${index === activeHeroSlide ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
                        <div className="relative mx-auto w-full max-w-7xl px-5 pb-36 sm:px-8">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest uppercase backdrop-blur">
                                <MapPin className="size-4 text-[#FBBF24]" />
                                {heroText?.header_1 || 'Southern Negros Occidental'}
                            </span>
                            <h1 className="mt-6 max-w-4xl text-5xl leading-[1.04] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                                {heroText?.header_2 ? (
                                    heroText.header_2
                                ) : (
                                    <>
                                        Discover the Beauty of <span className="text-[#FBBF24]">Hinoba-an</span>
                                    </>
                                )}
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
                                {heroText?.header_3 ||
                                    'Explore breathtaking beaches, hidden destinations, local experiences, accommodations, and unforgettable adventures in the southern paradise of Negros Occidental.'}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a
                                    href="#destinations"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-6 py-3.5 font-bold shadow-lg transition hover:-translate-y-0.5 hover:bg-[#C2410C]"
                                >
                                    Explore Destinations <ArrowRight className="size-4" />
                                </a>
                                <a
                                    href="#search"
                                    className="rounded-xl border border-white/70 bg-white/10 px-6 py-3.5 font-bold backdrop-blur transition hover:bg-white/20"
                                >
                                    Plan Your Visit
                                </a>
                            </div>
                        </div>

                        {slides.length > 1 && (
                            <div
                                className="absolute inset-x-0 bottom-28 z-20 mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8"
                                aria-label="Banner carousel controls"
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveHeroSlide((current) => (current - 1 + slides.length) % slides.length)}
                                    className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-black/25 backdrop-blur transition hover:bg-[#F97316]"
                                    aria-label="Previous banner"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>
                                <div className="flex gap-2">
                                    {slides.map((slide, index) => (
                                        <button
                                            key={slide.id}
                                            type="button"
                                            onClick={() => setActiveHeroSlide(index)}
                                            className={`h-2.5 rounded-full transition-all ${index === activeHeroSlide ? 'w-8 bg-[#FBBF24]' : 'w-2.5 bg-white/60 hover:bg-white'}`}
                                            aria-label={`Show banner ${index + 1}`}
                                            aria-current={index === activeHeroSlide}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveHeroSlide((current) => (current + 1) % slides.length)}
                                    className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-black/25 backdrop-blur transition hover:bg-[#F97316]"
                                    aria-label="Next banner"
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                            </div>
                        )}

                        <form
                            id="search"
                            onSubmit={submitSearch}
                            className="absolute inset-x-4 bottom-0 z-10 mx-auto grid max-w-6xl translate-y-1/2 gap-2 rounded-2xl bg-white p-3 text-[#1F2937] shadow-2xl sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
                        >
                            <label className="flex items-center gap-3 rounded-xl bg-[#FFFBF5] px-4 py-3">
                                <Search className="size-5 text-[#F97316]" />
                                <span className="min-w-0 flex-1">
                                    <small className="block text-[10px] font-bold tracking-wider text-[#64748B] uppercase">Search destination</small>
                                    <input
                                        className="w-full border-0 bg-transparent p-0 text-sm outline-none"
                                        placeholder="Beach, cave, waterfall…"
                                    />
                                </span>
                            </label>
                            <label className="flex items-center gap-3 rounded-xl bg-[#FFFBF5] px-4 py-3">
                                <Compass className="size-5 text-[#0F766E]" />
                                <span className="flex-1">
                                    <small className="block text-[10px] font-bold tracking-wider text-[#64748B] uppercase">Category</small>
                                    <select className="w-full bg-transparent text-sm outline-none">
                                        <option>All experiences</option>
                                        {categories.map((category) => (
                                            <option key={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </span>
                            </label>
                            <label className="flex items-center gap-3 rounded-xl bg-[#FFFBF5] px-4 py-3">
                                <MapPin className="size-5 text-[#0F766E]" />
                                <span>
                                    <small className="block text-[10px] font-bold tracking-wider text-[#64748B] uppercase">Location</small>
                                    <span className="text-sm">All barangays</span>
                                </span>
                            </label>
                            <button className="rounded-xl bg-[#F97316] px-7 py-4 font-bold text-white hover:bg-[#C2410C]">Search</button>
                        </form>
                    </section>

                    <section className="px-5 pt-36 pb-24 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <SectionHeading
                                eyebrow="Find your experience"
                                title="Explore Hinoba-an"
                                description="Discover experiences that match your adventure."
                            />
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {shownCategories.map((category, index) => {
                                    const Icon = categoryIcons[index];
                                    return (
                                        <a
                                            href="#destinations"
                                            key={category.id}
                                            className="group rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                                        >
                                            <span className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-[#F97316] transition group-hover:bg-[#F97316] group-hover:text-white">
                                                <Icon className="size-5" />
                                            </span>
                                            <h3 className="mt-5 font-bold">{category.name}</h3>
                                            <p className="mt-1 text-xs text-[#64748B]">
                                                {category.destinations_count} {category.destinations_count === 1 ? 'destination' : 'destinations'}
                                            </p>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section id="destinations" className="bg-white px-5 py-24 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <SectionHeading
                                eyebrow="Handpicked places"
                                title="Featured Destinations"
                                description="Explore remarkable places selected by the Hinoba-an Tourism Office."
                            />
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {destinations.length === 0 ? (
                                    <EmptyState label="Featured destinations" />
                                ) : (
                                    destinations.map((destination) => (
                                        <article
                                            key={destination.id}
                                            className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            <div className="relative h-60 overflow-hidden">
                                                <img
                                                    src={destination.image ?? heroImage}
                                                    alt={destination.name}
                                                    className="size-full object-cover transition duration-700 group-hover:scale-105"
                                                />
                                                <span className="absolute top-4 left-4 rounded-full bg-[#0F766E] px-3 py-1 text-xs font-bold text-white">
                                                    {destination.category ?? 'Destination'}
                                                </span>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                                                    <MapPin className="size-3.5 text-[#F97316]" /> Barangay {destination.barangay ?? 'Hinoba-an'}
                                                </div>
                                                <h3 className="mt-3 text-xl font-bold">{destination.name}</h3>
                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#64748B]">
                                                    {destination.description || destination.address}
                                                </p>
                                                <Link
                                                    href={route('destinations.show', destination.slug)}
                                                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#F97316]"
                                                >
                                                    View Details <ChevronRight className="size-4" />
                                                </Link>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                            <div className="mt-10 text-center">
                                <a
                                    href={route('interactive-map')}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#F97316] px-6 py-3 font-bold text-[#F97316] hover:bg-orange-50"
                                >
                                    View All Destinations <ArrowRight className="size-4" />
                                </a>
                            </div>
                        </div>
                    </section>

                    <section id="why-visit" className="bg-[#FFF3E6] px-5 py-24 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <SectionHeading
                                eyebrow={whyVisitSection?.eyebrow ?? 'More than a destination'}
                                title={whyVisitSection?.title ?? 'Why Visit Hinoba-an?'}
                                description={
                                    whyVisitSection?.subtitle ?? 'Nature, culture, adventure, and room to breathe—all in one welcoming municipality.'
                                }
                            />
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                {displayedReasons.map((reason, index) => {
                                    const Icon = reasonIcons[reason.icon as keyof typeof reasonIcons] ?? Sparkles;
                                    return (
                                        <div key={`${reason.title}-${index}`} className="rounded-2xl bg-white p-6 shadow-sm">
                                            <span
                                                className={`flex size-12 items-center justify-center rounded-xl ${index % 2 ? 'bg-teal-50 text-[#0F766E]' : 'bg-orange-50 text-[#F97316]'}`}
                                            >
                                                <Icon className="size-6" />
                                            </span>
                                            <h3 className="mt-5 text-lg font-bold">{reason.title}</h3>
                                            <p className="mt-2 text-sm leading-6 text-[#64748B]">{reason.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section id="accommodations" className="bg-white px-5 py-24 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <SectionHeading
                                eyebrow="Rest and recharge"
                                title="Where to Stay"
                                description="Find comfortable accommodations for your Hinoba-an adventure."
                            />
                            <div className="grid gap-6 md:grid-cols-3">
                                {accommodations.length === 0 ? (
                                    <EmptyState label="Verified accommodations" />
                                ) : (
                                    accommodations.map((item) => (
                                        <article key={item.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                                            <img src={item.image ?? heroImage} alt={item.name} className="h-56 w-full object-cover" />
                                            <div className="p-6">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0F766E]">
                                                        {item.type}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F766E]">
                                                        <CheckCircle2 className="size-4" /> Verified
                                                    </span>
                                                </div>
                                                <h3 className="mt-4 text-xl font-bold">{item.name}</h3>
                                                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#64748B]">
                                                    <MapPin className="size-3.5 text-[#F97316]" /> {item.barangay ?? item.address}
                                                </p>
                                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">{item.description}</p>
                                                <Link
                                                    href={route('enterprises.show', item.slug)}
                                                    prefetch
                                                    className="mt-5 inline-flex text-sm font-bold text-[#F97316] transition hover:text-[#C2410C]"
                                                >
                                                    View Accommodation →
                                                </Link>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                            <div className="mt-10 text-center">
                                <Link
                                    href={route('enterprises.index')}
                                    prefetch
                                    className="inline-flex rounded-xl border border-[#F97316] px-6 py-3 font-bold text-[#F97316] hover:bg-orange-50"
                                >
                                    View All Accommodations
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section id="enterprises" className="bg-[#FFFBF5] px-5 py-24 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <SectionHeading
                                eyebrow="Local tourism partners"
                                title="Explore Local Tourism Enterprises"
                                description="Discover resorts, accommodations, restaurants, tour operators, recreation providers, and other tourism businesses in Hinoba-an."
                            />
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {enterprises.length > 0 ? (
                                    enterprises.map((enterprise) => (
                                        <article
                                            key={enterprise.id}
                                            className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            <div className="relative h-48">
                                                <img
                                                    src={enterprise.cover_image_url ?? heroImage}
                                                    alt={enterprise.business_name}
                                                    className="size-full object-cover"
                                                />
                                                {enterprise.logo_url && (
                                                    <img
                                                        src={enterprise.logo_url}
                                                        alt=""
                                                        className="absolute -bottom-7 left-5 size-14 rounded-xl border-4 border-white bg-white object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="p-5 pt-10">
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F766E]">
                                                    <CheckCircle2 className="size-4" /> Verified{' '}
                                                    {enterprise.enterprise_type?.name ?? 'Tourism Enterprise'}
                                                </span>
                                                <h3 className="mt-2 text-xl font-extrabold">
                                                    <Link
                                                        href={route('enterprises.show', enterprise.slug)}
                                                        prefetch
                                                        className="transition hover:text-[#F97316] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
                                                    >
                                                        {enterprise.business_name}
                                                    </Link>
                                                </h3>
                                                <p className="mt-2 flex items-center gap-1 text-sm text-[#64748B]">
                                                    <MapPin className="size-4" /> Brgy. {enterprise.barangay?.name ?? 'Hinoba-an'}
                                                </p>
                                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">
                                                    {enterprise.description ?? 'Discover services offered by this verified local tourism enterprise.'}
                                                </p>
                                                {enterprise.services.length > 0 && (
                                                    <p className="mt-4 line-clamp-1 text-xs font-semibold text-[#0F766E]">
                                                        {enterprise.services.map((service) => service.name).join(' · ')}
                                                    </p>
                                                )}
                                                <Link
                                                    href={route('enterprises.show', enterprise.slug)}
                                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-bold text-white"
                                                >
                                                    View Enterprise <ArrowRight className="size-4" />
                                                </Link>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <EmptyState label="Tourism enterprises" />
                                )}
                            </div>
                            <div className="mt-10 text-center">
                                <Link
                                    href={route('enterprises.index')}
                                    className="inline-flex rounded-xl border border-[#F97316] px-6 py-3 font-bold text-[#F97316] hover:bg-orange-50"
                                >
                                    View All Enterprises
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#FFF3E6] px-5 py-20 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <p className="font-bold text-[#F97316]">SHOP LOCAL</p>
                                    <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Products Made in Hinoba-an</h2>
                                    <p className="mt-2 text-[#64748B]">Support verified local producers and order authentic products.</p>
                                </div>
                                <Link
                                    href={route('local-products.index')}
                                    className="rounded-xl border border-[#F97316] px-5 py-3 font-bold text-[#F97316]"
                                >
                                    View All Products
                                </Link>
                            </div>
                            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {localProducts.length ? (
                                    localProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={route('local-products.show', product.slug)}
                                            className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            <img
                                                src={product.main_image_url ?? '/images/tourism-placeholder.svg'}
                                                className="h-48 w-full object-cover"
                                            />
                                            <div className="p-5">
                                                <span className="text-xs font-bold text-[#0F766E]">{product.category.name}</span>
                                                <h3 className="mt-1 text-xl font-extrabold">{product.name}</h3>
                                                <p className="mt-1 text-sm text-[#64748B]">{product.enterprise.business_name}</p>
                                                <p className="mt-4 text-xl font-extrabold text-[#F97316]">
                                                    ₱{Number(product.price).toLocaleString()}{' '}
                                                    <small className="text-xs text-[#64748B]">/ {product.selling_unit}</small>
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <EmptyState label="Local products" />
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="px-5 py-20 sm:px-8">
                        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#0F766E] text-white lg:grid-cols-[1.3fr_.7fr]">
                            <div className="p-8 sm:p-12">
                                <p className="text-xs font-bold tracking-[.2em] text-[#FBBF24] uppercase">Tourism partners</p>
                                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Grow Your Tourism Business With Us</h2>
                                <p className="mt-5 max-w-2xl leading-7 text-white/75">
                                    Tourism enterprises operating within Hinoba-an can register their business, submit accommodations and tourism
                                    services, and reach more visitors through the Explore Hinoba-an Tourism Portal.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        href={route('partner.login')}
                                        className="rounded-xl bg-[#F97316] px-5 py-3 font-bold text-white hover:bg-[#C2410C]"
                                    >
                                        {headerSetting?.register_label ?? 'Be a Partner'}
                                    </Link>
                                    <Link href={route('login')} className="rounded-xl border border-white/50 px-5 py-3 font-bold hover:bg-white/10">
                                        {headerSetting?.login_label ?? 'Enterprise Login'}
                                    </Link>
                                </div>
                            </div>
                            <div className="flex min-h-64 items-center justify-center bg-white/10 p-10">
                                <div className="relative">
                                    <span className="flex size-36 items-center justify-center rounded-full bg-white/10">
                                        <Store className="size-16 text-[#FBBF24]" />
                                    </span>
                                    <span className="absolute -right-6 -bottom-4 flex size-16 items-center justify-center rounded-2xl bg-[#F97316]">
                                        <Building2 className="size-8" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="things-to-do" className="bg-white px-5 py-24 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <SectionHeading
                                eyebrow="Make memories"
                                title="Things to Do in Hinoba-an"
                                description="Fill your itinerary with nature, food, culture, and outdoor adventure."
                            />
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {activities.map(([title, icon, position]) => {
                                    const Icon = icon as typeof Waves;
                                    return (
                                        <article key={title as string} className="group relative h-72 overflow-hidden rounded-3xl">
                                            <img
                                                src={heroImage}
                                                alt=""
                                                className="size-full object-cover transition duration-700 group-hover:scale-110"
                                                style={{ objectPosition: position as string }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                                            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6 text-white">
                                                <span className="flex size-10 items-center justify-center rounded-xl bg-[#F97316]">
                                                    <Icon className="size-5" />
                                                </span>
                                                <h3 className="text-lg font-bold">{title as string}</h3>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section id="events" className="bg-[#FFF3E6] px-5 py-24 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <SectionHeading
                                eyebrow="Celebrate with us"
                                title="Upcoming Events & Festivals"
                                description="Join local celebrations, community activities, and cultural experiences."
                            />
                            <div className="grid gap-6 md:grid-cols-3">
                                {events.length === 0 ? (
                                    <EmptyState label="Upcoming events and festivals" />
                                ) : (
                                    events.map((event) => (
                                        <article key={event.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                                            <div className="relative h-52">
                                                <img src={event.image ?? heroImage} alt={event.title} className="size-full object-cover" />
                                                <span className="absolute top-4 left-4 flex size-16 flex-col items-center justify-center rounded-2xl bg-[#FBBF24] font-bold text-[#1F2937]">
                                                    <strong className="text-xl leading-none">{event.day ?? 'TBA'}</strong>
                                                    <small className="mt-1 uppercase">{event.month ?? ''}</small>
                                                </span>
                                            </div>
                                            <div className="p-6">
                                                <span className="text-xs font-bold text-[#0F766E]">{event.type}</span>
                                                <h3 className="mt-2 text-xl font-bold">{event.title}</h3>
                                                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#64748B]">
                                                    <MapPin className="size-3.5 text-[#F97316]" /> {event.venue}
                                                </p>
                                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">{event.description}</p>
                                                <button className="mt-5 text-sm font-bold text-[#F97316]">View Event →</button>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <section id="map" className="bg-white px-5 py-24 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <SectionHeading
                                eyebrow="Find your way"
                                title="Explore Hinoba-an on the Map"
                                description="Locate destinations and plan your route across the municipality."
                            />
                            <div className="mb-5 flex flex-wrap justify-center gap-2">
                                {['All Locations', 'Destinations', 'Accommodations', 'Restaurants', 'Attractions'].map((filter, index) => (
                                    <button
                                        key={filter}
                                        className={`rounded-full px-4 py-2 text-xs font-bold ${index === 0 ? 'bg-[#F97316] text-white' : 'bg-[#FFF3E6] text-[#64748B] hover:text-[#F97316]'}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            <TourismMap locations={mapLocations} />
                            <div className="mt-8 text-center">
                                <Link
                                    href={route('interactive-map')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-[#C2410C]"
                                >
                                    <MapPin className="size-5" />
                                    Open Interactive Map
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="border-y border-orange-100 bg-[#FFFBF5] px-5 py-16 sm:px-8">
                        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">
                            {[
                                [statistics.destinations, 'Tourism Destinations'],
                                [statistics.enterprises, 'Tourism Enterprises'],
                                [statistics.accommodations, 'Accommodations'],
                                [statistics.barangays, 'Barangays Covered'],
                            ].map(([value, label]) => (
                                <div key={label as string}>
                                    <strong className="text-4xl font-extrabold text-[#F97316]">{value as number}+</strong>
                                    <p className="mt-2 text-sm font-semibold text-[#64748B]">{label as string}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#F97316] px-5 py-20 text-center text-white sm:px-8">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-3xl font-extrabold sm:text-5xl">Your Hinoba-an Adventure Starts Here</h2>
                            <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/85">
                                Discover destinations, find accommodations, explore local experiences, and create unforgettable memories in Hinoba-an.
                            </p>
                            <a
                                href="#destinations"
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-[#F97316] shadow-lg transition hover:-translate-y-0.5"
                            >
                                Start Exploring <ArrowRight className="size-4" />
                            </a>
                        </div>
                    </section>
                </main>

                <footer id="contact" className="bg-[#0F766E] px-5 pt-16 text-white sm:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="flex items-center gap-2 text-lg font-bold">
                                    <Waves className="text-[#FBBF24]" /> Explore Hinoba-an
                                </div>
                                <p className="mt-4 text-sm leading-6 text-white/70">
                                    {footerSetting?.description ??
                                        'The official interactive tourism portal for discovering the beauty, culture, and adventures of Hinoba-an.'}
                                </p>
                                <div className="mt-5 flex gap-2">
                                    {[
                                        [Facebook, footerSetting?.facebook_url],
                                        [Instagram, footerSetting?.instagram_url],
                                        [Youtube, footerSetting?.youtube_url],
                                    ].map(([Icon, url], index) => (
                                        <a
                                            key={index}
                                            href={(url as string | null) ?? '#'}
                                            target={url ? '_blank' : undefined}
                                            rel={url ? 'noreferrer' : undefined}
                                            className="rounded-full border border-white/20 p-2.5 hover:bg-white/10"
                                        >
                                            <Icon className="size-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold">Quick Links</h3>
                                <div className="mt-4 grid gap-3 text-sm text-white/70">
                                    <a href="#destinations">Destinations</a>
                                    <a href="#accommodations">Accommodations</a>
                                    <a href="#events">Events</a>
                                    <a href="#things-to-do">Things to Do</a>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold">Tourism</h3>
                                <div className="mt-4 grid gap-3 text-sm text-white/70">
                                    <Link href={route('partner.register')}>Tourism Enterprise Registration</Link>
                                    <Link href={route('partner.login')}>Tourism Enterprise Login</Link>
                                    <Link href={route('reservations.status.create')}>Check Reservation Status</Link>
                                    <Link href={route('interactive-map')}>Travel Information</Link>
                                    <a href="#why-visit">Tourism Guidelines</a>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold">Contact</h3>
                                <div className="mt-4 grid gap-2 text-sm leading-6 text-white/70">
                                    <p>{footerSetting?.municipality ?? 'Municipality of Hinoba-an'}</p>
                                    <p>{footerSetting?.office ?? 'Municipal Tourism Office'}</p>
                                    <p>{footerSetting?.address ?? 'Negros Occidental, Philippines'}</p>
                                    <p>{footerSetting?.email ?? 'tourism@hinobaan.gov.ph'}</p>
                                    <p>{footerSetting?.phone ?? '+63 (000) 000 0000'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-white/15 py-6 text-center text-xs text-white/60">
                            {footerSetting?.copyright_text ?? '© 2026 Explore Hinoba-an. All Rights Reserved.'}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
