import DestinationMap from '@/components/landing/destination-map';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Globe, Mail, MapPin, Phone, Waves } from 'lucide-react';
interface Service {
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
interface Enterprise {
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
    services: Service[];
    gallery_images: { id: number; image_url: string; caption: string | null }[];
}
export default function Show({ enterprise: e }: { enterprise: Enterprise }) {
    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title={e.business_name} />
            <header className="border-b bg-white">
                <div className="mx-auto flex h-18 max-w-7xl items-center px-5">
                    <Link href={route('home')} className="flex items-center gap-2 font-bold">
                        <Waves className="text-[#F97316]" />
                        Explore Hinoba-an
                    </Link>
                </div>
            </header>
            <section className="relative h-[430px] overflow-hidden">
                <img src={e.cover_image_url ?? '/images/landing/hinobaan-hero.png'} alt={e.business_name} className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl items-end gap-5 px-5 pb-10 text-white">
                    {e.logo_url && <img src={e.logo_url} alt="" className="size-24 rounded-2xl border-4 border-white bg-white object-cover" />}
                    <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0F766E] px-3 py-1 text-xs font-bold">
                            <CheckCircle2 className="size-4" />
                            Verified {e.enterprise_type.name}
                        </span>
                        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{e.business_name}</h1>
                        <p className="mt-2 flex gap-2">
                            <MapPin />
                            Brgy. {e.barangay?.name ?? 'Hinoba-an'}, Hinoba-an
                        </p>
                    </div>
                </div>
            </section>
            <main className="mx-auto max-w-7xl space-y-16 px-5 py-14">
                <section>
                    <h2 className="text-3xl font-extrabold">About the Enterprise</h2>
                    <p className="mt-5 max-w-4xl leading-8 whitespace-pre-line text-[#64748B]">
                        {e.description || 'More information will be available soon.'}
                    </p>
                </section>
                <section>
                    <h2 className="text-3xl font-extrabold">Services & Facilities</h2>
                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {e.services.map((s) => (
                            <article key={s.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                                <img
                                    src={s.main_image_url ?? e.cover_image_url ?? '/images/landing/hinobaan-hero.png'}
                                    alt={s.name}
                                    className="h-44 w-full object-cover"
                                />
                                <div className="p-5">
                                    <span className="text-xs font-bold text-[#0F766E]">{s.service_type?.name}</span>
                                    <h3 className="mt-1 text-xl font-bold">{s.name}</h3>
                                    <p className="mt-2 line-clamp-2 text-sm text-[#64748B]">{s.short_description}</p>
                                    <p className="mt-4 text-lg font-extrabold text-[#F97316]">
                                        ₱{Number(s.price).toLocaleString('en-PH')} / {s.pricing_unit.replace('per_', '')}
                                    </p>
                                    <p className="mt-1 text-xs text-[#64748B]">
                                        {s.quantity} available{s.capacity ? ` · Up to ${s.capacity} guests` : ''}
                                    </p>
                                    <Link
                                        href={route('enterprises.services.show', [e.slug, s.slug])}
                                        className="mt-4 inline-flex rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-bold text-white"
                                    >
                                        View Details{s.reservation_required ? ' & Reserve' : ''}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                    {e.services.length === 0 && <p className="mt-5 text-[#64748B]">No published services are available yet.</p>}
                </section>
                <section>
                    <h2 className="mb-6 text-3xl font-extrabold">Location</h2>
                    <DestinationMap name={e.business_name} address={e.address} latitude={e.latitude} longitude={e.longitude} />
                </section>
                {e.gallery_images.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-extrabold">Photo Gallery</h2>
                        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                            {e.gallery_images.map((i) => (
                                <img
                                    key={i.id}
                                    src={i.image_url}
                                    alt={i.caption ?? e.business_name}
                                    className="aspect-square w-full rounded-2xl object-cover"
                                />
                            ))}
                        </div>
                    </section>
                )}
                <section className="rounded-3xl bg-[#0F766E] p-8 text-white">
                    <h2 className="text-2xl font-extrabold">Contact Information</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <Contact icon={Phone} label="Phone" value={e.phone} href={e.phone ? `tel:${e.phone}` : undefined} />
                        <Contact icon={Mail} label="Email" value={e.email} href={e.email ? `mailto:${e.email}` : undefined} />
                        <Contact icon={Globe} label="Website" value={e.website} href={e.website ?? undefined} />
                    </div>
                </section>
            </main>
        </div>
    );
}
function Contact({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string | null; href?: string }) {
    const body = (
        <>
            <Icon className="size-5 text-[#FBBF24]" />
            <span>
                <small className="block text-teal-100">{label}</small>
                {value || 'Not available'}
            </span>
        </>
    );
    return href ? (
        <a href={href} target={label === 'Website' ? '_blank' : undefined} rel="noreferrer" className="flex gap-3">
            {body}
        </a>
    ) : (
        <div className="flex gap-3">{body}</div>
    );
}
