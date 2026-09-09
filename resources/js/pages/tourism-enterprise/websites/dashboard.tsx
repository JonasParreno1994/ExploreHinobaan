import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Globe2, Palette } from 'lucide-react';

export default function Dashboard({
    enterprise,
    website,
    completionPercentage,
    publicUrl,
}: {
    enterprise: WebsiteEnterprise;
    website: EnterpriseWebsite;
    completionPercentage: number;
    publicUrl: string;
}) {
    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title={`${enterprise.business_name} Website`} />
            <div className="rounded-3xl bg-gradient-to-br from-teal-800 to-teal-600 p-7 text-white">
                <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                        <p className="text-xs font-bold tracking-widest text-teal-100 uppercase">Website Dashboard</p>
                        <h1 className="mt-2 text-3xl font-extrabold">{enterprise.business_name}</h1>
                        <p className="mt-2 text-teal-50">Build a complete, trustworthy website for visitors.</p>
                    </div>
                    <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">{website.is_published ? 'Published' : 'Draft'}</span>
                </div>
                <div className="mt-7">
                    <div className="flex justify-between text-sm font-bold">
                        <span>Website completion</span>
                        <span>{completionPercentage}%</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
                        <div className="h-full rounded-full bg-amber-300" style={{ width: `${completionPercentage}%` }} />
                    </div>
                </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
                <article className="rounded-3xl border border-orange-100 bg-white p-6">
                    <Globe2 className="text-teal-700" />
                    <h2 className="mt-4 font-extrabold">Public website URL</h2>
                    <a href={publicUrl} className="mt-2 block text-sm break-all text-teal-700 underline">
                        {publicUrl}
                    </a>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                            href={route('partner.websites.preview', enterprise.id)}
                            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold"
                        >
                            <Eye className="size-4" /> Preview Website
                        </Link>
                        <Link
                            href={route('partner.websites.appearance', enterprise.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white"
                        >
                            <Palette className="size-4" /> Edit Website
                        </Link>
                    </div>
                </article>
                <article className="rounded-3xl border border-orange-100 bg-white p-6">
                    <h2 className="font-extrabold">Website status</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Publish when your shared content is ready. Existing services, bookings, products, reviews, and contact details remain
                        connected.
                    </p>
                    <button
                        type="button"
                        onClick={() => router.patch(route('partner.websites.publish', enterprise.id), { is_published: !website.is_published })}
                        className="mt-5 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white"
                    >
                        {website.is_published ? 'Return to draft' : 'Publish website'}
                    </button>
                </article>
            </div>
        </WebsiteShell>
    );
}
