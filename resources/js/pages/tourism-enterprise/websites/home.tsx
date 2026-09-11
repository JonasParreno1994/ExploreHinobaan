import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowRight, ArrowUp, Eye, GripVertical, Info } from 'lucide-react';
import { FormEvent } from 'react';

interface HomepageSection {
    id: number;
    section_type: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    is_visible: boolean;
    sort_order: number;
    settings: { featured_ids?: number[] } | null;
}

interface ContentDestination {
    href: string;
    label: string;
}

function contentDestination(sectionType: string, enterprise: WebsiteEnterprise): ContentDestination | null {
    const serviceModules: Record<string, string> = {
        builder_amenities: 'amenities',
        builder_activities: 'activities',
        builder_featured_services: 'services',
        builder_rooms: 'rooms',
    };

    if (serviceModules[sectionType]) {
        return {
            href: route('partner.services.index', { enterprise: enterprise.id, module: serviceModules[sectionType] }),
            label: 'Services & Facilities',
        };
    }

    const destinations: Record<string, ContentDestination> = {
        builder_hero: { href: route('partner.websites.appearance', enterprise.id), label: 'Appearance' },
        builder_about: { href: route('partner.websites.sections.edit', [enterprise.id, 'about']), label: 'About Us' },
        builder_products: { href: route('partner.products.index'), label: 'Local Products' },
        builder_menu: { href: route('partner.websites.menu', enterprise.id), label: 'Menu' },
        builder_tour_packages: { href: route('partner.websites.tours', enterprise.id), label: 'Tour Packages' },
        builder_gallery: { href: route('partner.websites.gallery', enterprise.id), label: 'Gallery' },
        builder_location: { href: route('partner.websites.location', enterprise.id), label: 'Location' },
        builder_contact: { href: route('partner.websites.contact', enterprise.id), label: 'Contact & Social Media' },
    };

    return destinations[sectionType] ?? null;
}

export default function HomeEditor({ enterprise, website, sections }: { enterprise: WebsiteEnterprise; website: EnterpriseWebsite; sections: HomepageSection[] }) {
    const form = useForm({ sections });

    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= form.data.sections.length) {
            return;
        }

        const next = [...form.data.sections];
        [next[index], next[target]] = [next[target], next[index]];
        form.setData('sections', next.map((section, order) => ({ ...section, sort_order: (order + 1) * 10 })));
    };

    const update = (index: number, values: Partial<HomepageSection>) => {
        form.setData('sections', form.data.sections.map((section, position) => (position === index ? { ...section, ...values } : section)));
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(route('partner.websites.home.update', enterprise.id), { preserveScroll: true });
    };

    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title="Homepage Builder" />
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Website builder</p>
                    <h1 className="mt-2 text-3xl font-extrabold">Home Page</h1>
                    <p className="mt-2 text-sm text-slate-600">Control how your existing content is arranged and presented. No coding required.</p>
                </div>
                <Link href={route('partner.websites.preview', enterprise.id)} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold">
                    <Eye className="size-4" /> Preview My Website
                </Link>
            </div>

            <div className="mt-6 flex gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-950">
                <Info className="mt-0.5 size-5 shrink-0 text-teal-700" />
                <div>
                    <p className="font-extrabold">One source for every business record</p>
                    <p className="mt-1 leading-6 text-teal-900">
                        Services &amp; Facilities and the related business modules manage your operational and bookable records. My Website only controls how that content appears publicly, including section headings, visibility, and order.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="mt-6 grid gap-4">
                {form.data.sections.map((section, index) => {
                    const destination = contentDestination(section.section_type, enterprise);

                    return (
                        <article key={section.id} className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3">
                                <GripVertical className="size-5 text-slate-400" />
                                <div className="min-w-0 flex-1">
                                    <strong>{section.title}</strong>
                                    <small className="block capitalize text-slate-500">{section.section_type.replace('builder_', '').replaceAll('_', ' ')}</small>
                                </div>
                                {destination && (
                                    <Link href={destination.href} className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-50">
                                        Manage Content in {destination.label} <ArrowRight className="size-3.5" />
                                    </Link>
                                )}
                                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded-lg border p-2 disabled:opacity-30" aria-label="Move up">
                                    <ArrowUp className="size-4" />
                                </button>
                                <button type="button" onClick={() => move(index, 1)} disabled={index === form.data.sections.length - 1} className="rounded-lg border p-2 disabled:opacity-30" aria-label="Move down">
                                    <ArrowDown className="size-4" />
                                </button>
                                <label className="flex items-center gap-2 text-sm font-bold">
                                    <input type="checkbox" checked={section.is_visible} onChange={(event) => update(index, { is_visible: event.target.checked })} /> Enabled
                                </label>
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <label className="grid gap-1 text-xs font-bold">
                                    Display title
                                    <input value={section.title ?? ''} onChange={(event) => update(index, { title: event.target.value })} className="h-10 rounded-xl border px-3 text-sm font-normal" />
                                </label>
                                <label className="grid gap-1 text-xs font-bold">
                                    Display subtitle
                                    <input value={section.subtitle ?? ''} onChange={(event) => update(index, { subtitle: event.target.value })} className="h-10 rounded-xl border px-3 text-sm font-normal" />
                                </label>
                            </div>
                        </article>
                    );
                })}
                <div className="sticky bottom-4 flex items-center justify-between rounded-2xl bg-slate-950 p-4 text-white shadow-xl">
                    <span className="text-sm">Status: <strong>{website.is_published ? 'Published · draft changes pending' : 'Draft'}</strong></span>
                    <button disabled={form.processing} className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold">Save Draft</button>
                </div>
            </form>
        </WebsiteShell>
    );
}
