import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Globe2 } from 'lucide-react';

interface Enterprise {
    id: number;
    business_name: string;
    slug: string;
    microsite: { is_published: boolean } | null;
    gallery_images_count: number;
    sections_count: number;
}

export default function Index({ enterprises }: { enterprises: Enterprise[] }) {
    return (
        <PartnerLayout>
            <Head title="My Website" />
            <div>
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Enterprise microsites</p>
                <h1 className="mt-2 text-3xl font-extrabold">My Website</h1>
                <p className="mt-2 text-slate-600">Choose an approved enterprise to build and publish its mini-website.</p>
                <div className="mt-6 grid gap-4">
                    {enterprises.map((enterprise) => (
                        <article
                            key={enterprise.id}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                                    <Globe2 />
                                </span>
                                <div>
                                    <h2 className="font-extrabold">{enterprise.business_name}</h2>
                                    <p className="text-sm text-slate-500">
                                        {enterprise.microsite?.is_published ? 'Published' : 'Draft'} · {enterprise.gallery_images_count} gallery
                                        images
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route('partner.websites.dashboard', enterprise.id)}
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white"
                            >
                                Manage Website <ArrowRight className="size-4" />
                            </Link>
                        </article>
                    ))}
                    {enterprises.length === 0 && (
                        <div className="rounded-3xl border border-dashed p-10 text-center text-slate-500">
                            An approved enterprise is required before a website can be created.
                        </div>
                    )}
                </div>
            </div>
        </PartnerLayout>
    );
}
