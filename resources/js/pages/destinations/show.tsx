import DestinationMap from '@/components/landing/destination-map';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ChevronRight, Clock3, Globe, Mail, MapPin, Navigation, Phone, Ticket, Waves, X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

interface Taxonomy {
    id: number;
    name: string;
}
interface DestinationImage {
    id: number;
    image_url: string;
    caption: string | null;
}
interface Destination {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    address: string;
    latitude: string | null;
    longitude: string | null;
    entrance_fee: string | null;
    opening_time: string | null;
    closing_time: string | null;
    contact_number: string | null;
    email: string | null;
    website: string | null;
    featured_image_url: string | null;
    category: Taxonomy | null;
    barangay: Taxonomy | null;
    images: DestinationImage[];
}
interface RelatedDestination {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    featured_image_url: string | null;
    category: Taxonomy | null;
    barangay: Taxonomy | null;
}

const fallbackImage = '/images/landing/hinobaan-hero.png';

function formatTime(value: string | null): string {
    if (!value) return 'Not specified';
    const [hours, minutes] = value.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 'Not specified';
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function formatFee(value: string | null): string {
    if (value === null || value === '') return 'Not specified';
    const amount = Number(value);
    if (!Number.isFinite(amount)) return 'Not specified';
    if (amount === 0) return 'Free Admission';
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}

export default function DestinationShow({
    destination,
    relatedDestinations,
}: {
    destination: Destination;
    relatedDestinations: RelatedDestination[];
}) {
    const [activeImage, setActiveImage] = useState<number | null>(null);
    const gallery = destination.images;

    useEffect(() => {
        if (activeImage === null) return;
        function onKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape') setActiveImage(null);
            if (event.key === 'ArrowLeft') setActiveImage((current) => (current === null ? null : (current - 1 + gallery.length) % gallery.length));
            if (event.key === 'ArrowRight') setActiveImage((current) => (current === null ? null : (current + 1) % gallery.length));
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [activeImage, gallery.length]);

    const location = destination.barangay ? `Barangay ${destination.barangay.name}, Hinoba-an, Negros Occidental` : 'Hinoba-an, Negros Occidental';
    const hasCoordinates = Boolean(destination.latitude && destination.longitude);
    const directionsUrl = hasCoordinates
        ? `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`
        : null;

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title={`${destination.name} | Explore Hinoba-an`} />
            <header className="sticky top-0 z-[1000] border-b border-orange-100 bg-white/95 backdrop-blur-xl">
                <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5">
                    <Link href={route('home')} className="flex items-center gap-3 font-bold">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#F97316] text-white">
                            <Waves />
                        </span>
                        Explore Hinoba-an
                    </Link>
                    <Link href={route('home')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E]">
                        <ArrowLeft className="size-4" /> Back to Home
                    </Link>
                </nav>
            </header>

            <main>
                <section className="relative min-h-[520px] overflow-hidden">
                    <img
                        src={destination.featured_image_url ?? fallbackImage}
                        alt={destination.name}
                        className="absolute inset-0 size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/45 to-slate-950/10" />
                    <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-end px-5 py-14 text-white sm:px-8">
                        <div className="mb-auto flex flex-wrap items-center gap-2 pt-5 text-sm text-white/75">
                            <Link href={route('home')}>Home</Link>
                            <ChevronRight className="size-4" />
                            <Link href={`${route('home')}#destinations`}>Destinations</Link>
                            <ChevronRight className="size-4" />
                            <span className="text-white">{destination.name}</span>
                        </div>
                        {destination.category && (
                            <span className="mb-4 w-fit rounded-full bg-[#0F766E] px-4 py-1.5 text-sm font-bold">{destination.category.name}</span>
                        )}
                        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl">{destination.name}</h1>
                        <p className="mt-4 flex items-center gap-2 text-base text-white/90 sm:text-lg">
                            <MapPin className="size-5 text-[#FBBF24]" />
                            {location}
                        </p>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl space-y-20 px-5 py-16 sm:px-8">
                    <section className="max-w-4xl">
                        <p className="text-xs font-bold tracking-[.2em] text-[#F97316] uppercase">About this destination</p>
                        <h2 className="mt-3 text-3xl font-bold">Discover {destination.name}</h2>
                        <div className="mt-6 text-lg leading-8 whitespace-pre-line text-[#64748B]">
                            {destination.description ||
                                destination.short_description ||
                                'More information about this destination will be available soon.'}
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-2">
                        <InfoCard title="Visitor Information">
                            <InfoRow
                                icon={MapPin}
                                label="Barangay"
                                value={destination.barangay ? `Barangay ${destination.barangay.name}` : 'Not specified'}
                            />
                            <InfoRow icon={Navigation} label="Address" value={destination.address || 'Not specified'} />
                            <InfoRow icon={Ticket} label="Entrance Fee" value={formatFee(destination.entrance_fee)} />
                            <InfoRow
                                icon={Clock3}
                                label="Opening Hours"
                                value={`${formatTime(destination.opening_time)} – ${formatTime(destination.closing_time)}`}
                            />
                        </InfoCard>
                        <InfoCard title="Contact Information">
                            <InfoRow
                                icon={Phone}
                                label="Contact Number"
                                value={destination.contact_number || 'Not available'}
                                href={destination.contact_number ? `tel:${destination.contact_number}` : undefined}
                            />
                            <InfoRow
                                icon={Mail}
                                label="Email"
                                value={destination.email || 'Not available'}
                                href={destination.email ? `mailto:${destination.email}` : undefined}
                            />
                            <InfoRow
                                icon={Globe}
                                label="Website"
                                value={destination.website || 'Not available'}
                                href={destination.website || undefined}
                                external
                            />
                        </InfoCard>
                    </section>

                    <section>
                        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold tracking-[.2em] text-[#F97316] uppercase">Location</p>
                                <h2 className="mt-2 text-3xl font-bold">Find {destination.name}</h2>
                            </div>
                            {directionsUrl && (
                                <a
                                    href={directionsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-5 py-3 font-bold text-white hover:bg-[#C2410C]"
                                >
                                    <Navigation className="size-4" /> Get Directions
                                </a>
                            )}
                        </div>
                        <DestinationMap
                            name={destination.name}
                            address={destination.address}
                            latitude={destination.latitude}
                            longitude={destination.longitude}
                        />
                    </section>

                    {gallery.length > 0 && (
                        <section>
                            <p className="text-xs font-bold tracking-[.2em] text-[#F97316] uppercase">Memories await</p>
                            <h2 className="mt-2 text-3xl font-bold">Photo Gallery</h2>
                            <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {gallery.map((image, index) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => setActiveImage(index)}
                                        className="group overflow-hidden rounded-2xl"
                                    >
                                        <img
                                            src={image.image_url}
                                            alt={image.caption ?? `${destination.name} photo ${index + 1}`}
                                            className="aspect-square size-full object-cover transition duration-500 group-hover:scale-110"
                                        />
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {relatedDestinations.length > 0 && (
                        <section>
                            <p className="text-xs font-bold tracking-[.2em] text-[#F97316] uppercase">Continue exploring</p>
                            <h2 className="mt-2 text-3xl font-bold">You May Also Like</h2>
                            <div className="mt-7 grid gap-6 md:grid-cols-3">
                                {relatedDestinations.map((related) => (
                                    <article key={related.id} className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                                        <img
                                            src={related.featured_image_url ?? fallbackImage}
                                            alt={related.name}
                                            className="h-52 w-full object-cover"
                                        />
                                        <div className="p-5">
                                            <p className="text-xs font-bold text-[#0F766E]">{related.category?.name ?? 'Destination'}</p>
                                            <h3 className="mt-2 text-xl font-bold">{related.name}</h3>
                                            <p className="mt-2 text-sm text-[#64748B]">Barangay {related.barangay?.name ?? 'Hinoba-an'}</p>
                                            <Link
                                                href={route('destinations.show', related.slug)}
                                                className="mt-5 inline-flex items-center gap-1 font-bold text-[#F97316]"
                                            >
                                                View Details <ChevronRight className="size-4" />
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {activeImage !== null && gallery[activeImage] && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/95 p-4">
                    <button
                        type="button"
                        aria-label="Close gallery"
                        onClick={() => setActiveImage(null)}
                        className="absolute top-5 right-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                    >
                        <X />
                    </button>
                    {gallery.length > 1 && (
                        <button
                            type="button"
                            aria-label="Previous photo"
                            onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)}
                            className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                        >
                            <ArrowLeft />
                        </button>
                    )}
                    <img
                        src={gallery[activeImage].image_url}
                        alt={gallery[activeImage].caption ?? destination.name}
                        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
                    />
                    {gallery.length > 1 && (
                        <button
                            type="button"
                            aria-label="Next photo"
                            onClick={() => setActiveImage((activeImage + 1) % gallery.length)}
                            className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                        >
                            <ArrowRight />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="mt-6 divide-y divide-slate-100">{children}</div>
        </article>
    );
}
function InfoRow({
    icon: Icon,
    label,
    value,
    href,
    external = false,
}: {
    icon: typeof MapPin;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
}) {
    const content = <span className="font-semibold break-words text-[#1F2937]">{value}</span>;
    return (
        <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#F97316]">
                <Icon className="size-5" />
            </span>
            <div className="grid gap-1">
                <span className="text-xs font-bold tracking-wide text-[#64748B] uppercase">{label}</span>
                {href ? (
                    <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                        className="text-[#0F766E] hover:underline"
                    >
                        {content}
                    </a>
                ) : (
                    content
                )}
            </div>
        </div>
    );
}
