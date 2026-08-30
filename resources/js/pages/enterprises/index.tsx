import { BackToLanding } from '@/components/back-to-landing';
import { SiteBrand } from '@/components/site-brand';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, MapPin, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
interface Enterprise {
    id: number;
    slug: string;
    business_name: string;
    description: string | null;
    cover_image_url: string | null;
    logo_url: string | null;
    enterprise_type: { name: string };
    barangay: { name: string } | null;
    services: { name: string; price: string; pricing_unit: string }[];
}
export default function Index({
    enterprises,
    types,
    filters,
}: {
    enterprises: { data: Enterprise[] };
    types: { id: number; name: string }[];
    filters: { search?: string; type?: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('enterprises.index'), { search, type: filters.type }, { preserveState: true });
    };
    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title="Tourism Enterprises" />
            <header className="border-b bg-white">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5">
                    <Link href={route('home')} className="flex items-center gap-2 font-bold">
                        <SiteBrand compact />
                    </Link>
                    <div className="flex items-center gap-2">
                        <BackToLanding compact />
                        <Link href={route('partner.login')} className="rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-bold text-white">
                            Be a Partner
                        </Link>
                    </div>
                </div>
            </header>
            <main>
                <section className="bg-[#0F766E] px-5 py-16 text-center text-white">
                    <p className="text-xs font-bold tracking-widest text-[#FBBF24] uppercase">Local tourism partners</p>
                    <h1 className="mt-3 text-4xl font-extrabold">Explore Local Tourism Enterprises</h1>
                    <p className="mx-auto mt-4 max-w-3xl text-teal-50">
                        Discover resorts, accommodations, restaurants, tour operators, recreation providers, and other tourism businesses in
                        Hinoba-an.
                    </p>
                </section>
                <section className="mx-auto max-w-7xl px-5 py-10">
                    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#64748B]" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tourism enterprises..."
                                className="h-12 w-full rounded-xl border pl-12"
                            />
                        </div>
                        <select
                            value={filters.type ?? ''}
                            onChange={(e) => router.get(route('enterprises.index'), { search, type: e.target.value }, { preserveState: true })}
                            className="h-12 rounded-xl border px-4"
                        >
                            <option value="">All enterprise types</option>
                            {types.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                        <button className="rounded-xl bg-[#F97316] px-6 font-bold text-white">Search</button>
                    </form>
                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {enterprises.data.map((e) => (
                            <EnterpriseCard key={e.id} enterprise={e} />
                        ))}
                    </div>
                    {enterprises.data.length === 0 && <p className="py-16 text-center text-[#64748B]">No approved enterprises match your search.</p>}
                </section>
            </main>
        </div>
    );
}
export function EnterpriseCard({ enterprise: e }: { enterprise: Enterprise }) {
    const starting = e.services.length ? Math.min(...e.services.map((s) => Number(s.price))) : null;
    return (
        <article className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
            <div className="relative h-52">
                <img src={e.cover_image_url ?? '/images/landing/hinobaan-hero.png'} alt={e.business_name} className="size-full object-cover" />
                {e.logo_url && (
                    <img
                        src={e.logo_url}
                        alt=""
                        className="absolute -bottom-7 left-5 size-16 rounded-2xl border-4 border-white bg-white object-cover shadow"
                    />
                )}
            </div>
            <div className={`p-6 ${e.logo_url ? 'pt-10' : ''}`}>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F766E]">
                    <CheckCircle2 className="size-4" />
                    Verified Tourism Enterprise
                </span>
                <h2 className="mt-2 text-xl font-extrabold">
                    <Link
                        href={route('enterprises.show', e.slug)}
                        prefetch
                        className="transition hover:text-[#F97316] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
                    >
                        {e.business_name}
                    </Link>
                </h2>
                <p className="mt-1 text-xs font-bold text-[#F97316]">{e.enterprise_type.name}</p>
                <p className="mt-3 flex gap-1 text-sm text-[#64748B]">
                    <MapPin className="size-4" />
                    Brgy. {e.barangay?.name ?? 'Hinoba-an'}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">
                    {e.description || 'Discover this verified local tourism enterprise.'}
                </p>
                {e.services.length > 0 && (
                    <p className="mt-3 line-clamp-1 text-xs font-semibold text-[#0F766E]">{e.services.map((s) => s.name).join(' • ')}</p>
                )}
                {starting !== null && <p className="mt-3 font-bold text-[#F97316]">Starting at ₱{starting.toLocaleString('en-PH')}</p>}
                <Link
                    href={route('enterprises.show', e.slug)}
                    className="mt-5 inline-flex rounded-xl bg-[#F97316] px-5 py-3 text-sm font-bold text-white"
                >
                    View Enterprise
                </Link>
            </div>
        </article>
    );
}
