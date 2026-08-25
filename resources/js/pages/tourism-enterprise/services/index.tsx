import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Archive, Edit3, Plus } from 'lucide-react';
interface Service {
    id: number;
    name: string;
    price: string;
    pricing_unit: string;
    quantity: number;
    status: string;
    main_image_url: string | null;
    enterprise: { business_name: string };
    service_type: { name: string } | null;
    images_count: number;
}
export default function ServicesIndex({ services }: { services: { data: Service[] } }) {
    return (
        <PartnerLayout>
            <Head title="Services & Facilities" />
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-bold tracking-widest text-[#F97316] uppercase">Business offerings</p>
                    <h1 className="mt-2 text-3xl font-extrabold">Services & Facilities</h1>
                    <p className="mt-2 text-sm text-[#64748B]">Manage prices, capacity, photos, availability, and publication.</p>
                </div>
                <Button asChild className="bg-[#F97316] hover:bg-[#C2410C]">
                    <Link href={route('partner.services.create')}>
                        <Plus />
                        Add service
                    </Link>
                </Button>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
                {services.data.map((service) => (
                    <article key={service.id} className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                        <img
                            src={service.main_image_url ?? '/images/landing/hinobaan-hero.png'}
                            alt={service.name}
                            className="h-44 w-full object-cover"
                        />
                        <div className="p-5">
                            <div className="flex justify-between gap-3">
                                <div>
                                    <span className="text-xs font-bold text-[#0F766E]">{service.service_type?.name ?? 'Service'}</span>
                                    <h2 className="mt-1 text-xl font-bold">{service.name}</h2>
                                    <p className="text-xs text-[#64748B]">{service.enterprise.business_name}</p>
                                </div>
                                <span className="h-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#F97316] capitalize">
                                    {service.status}
                                </span>
                            </div>
                            <div className="mt-4 flex justify-between text-sm">
                                <strong className="text-[#F97316]">
                                    ₱{Number(service.price).toLocaleString('en-PH')} / {service.pricing_unit.replace('per_', '')}
                                </strong>
                                <span>{service.quantity} available</span>
                            </div>
                            <div className="mt-5 flex gap-2 border-t pt-4">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('partner.services.edit', service.id)}>
                                        <Edit3 />
                                        Edit
                                    </Link>
                                </Button>
                                {service.status !== 'archived' && (
                                    <Button variant="outline" size="sm" onClick={() => router.patch(route('partner.services.archive', service.id))}>
                                        <Archive />
                                        Archive
                                    </Button>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            {services.data.length === 0 && (
                <div className="mt-8 rounded-3xl border border-dashed p-10 text-center text-[#64748B]">
                    No services yet. Add your first room, cottage, tour, activity, or facility.
                </div>
            )}
        </PartnerLayout>
    );
}
