import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, FileText, MapPin, Phone, Wrench } from 'lucide-react';

interface Enterprise {
    id: number;
    slug: string;
    business_name: string;
    contact_person: string;
    email: string;
    phone: string | null;
    description: string | null;
    address: string;
    license_number: string | null;
    application_status: string;
    logo_url: string | null;
    cover_image_url: string | null;
    documents_count: number;
    services_count: number;
    reservations_count: number;
    enterprise_type: { name: string } | null;
}

export default function EnterpriseIndex({ enterprises }: { enterprises: Enterprise[] }) {
    return (
        <PartnerLayout>
            <Head title="My Enterprises" />
            <p className="text-xs font-bold tracking-widest text-[#F97316] uppercase">Business profile</p>
            <h1 className="mt-2 text-3xl font-extrabold">My Enterprises</h1>
            <p className="mt-2 text-[#64748B]">Review the enterprise information connected to your partner account.</p>
            <div className="mt-7 grid gap-6">
                {enterprises.map((enterprise) => (
                    <article key={enterprise.id} className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                        <div className="grid lg:grid-cols-[300px_1fr]">
                            <div className="relative min-h-64 bg-[#FFF3E6]">
                                <img
                                    src={enterprise.cover_image_url ?? '/images/landing/hinobaan-hero.png'}
                                    alt={enterprise.business_name}
                                    className="absolute inset-0 size-full object-cover"
                                />
                                {enterprise.logo_url && (
                                    <img
                                        src={enterprise.logo_url}
                                        alt=""
                                        className="absolute bottom-5 left-5 size-20 rounded-2xl border-4 border-white bg-white object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-7">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-bold text-[#0F766E]">
                                            {enterprise.enterprise_type?.name ?? 'Tourism Enterprise'}
                                        </span>
                                        <h2 className="mt-1 text-2xl font-extrabold">{enterprise.business_name}</h2>
                                    </div>
                                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0F766E] capitalize">
                                        {enterprise.application_status}
                                    </span>
                                </div>
                                <p className="mt-4 flex gap-2 text-sm text-[#64748B]">
                                    <MapPin className="size-4 shrink-0 text-[#F97316]" />
                                    {enterprise.address}
                                </p>
                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#64748B]">
                                    {enterprise.description || 'No description supplied.'}
                                </p>
                                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                                    <p>
                                        <strong>Contact person:</strong> {enterprise.contact_person}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {enterprise.email}
                                    </p>
                                    <p className="flex gap-2">
                                        <Phone className="size-4" />
                                        {enterprise.phone || 'Not available'}
                                    </p>
                                    <p>
                                        <strong>License:</strong> {enterprise.license_number || 'Not available'}
                                    </p>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={route('partner.services.index')}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-bold text-white"
                                    >
                                        <Wrench className="size-4" />
                                        {enterprise.services_count} Services
                                    </Link>
                                    <Link
                                        href={route('partner.documents.index')}
                                        className="inline-flex items-center gap-2 rounded-xl border border-[#0F766E] px-4 py-2.5 text-sm font-bold text-[#0F766E]"
                                    >
                                        <FileText className="size-4" />
                                        {enterprise.documents_count} Documents
                                    </Link>
                                    {enterprise.application_status === 'approved' && (
                                        <Link
                                            href={route('enterprises.show', enterprise.slug)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-bold text-[#F97316]"
                                        >
                                            <Building2 className="size-4" />
                                            Public Profile
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
                {enterprises.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-12 text-center text-[#64748B]">
                        No enterprise is connected to this account.
                    </div>
                )}
            </div>
        </PartnerLayout>
    );
}
