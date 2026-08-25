import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import ServiceForm, { ServiceData } from '@/components/tourism-enterprise/service-form';
import { Head } from '@inertiajs/react';
export default function Edit({
    service,
    enterprises,
    serviceTypes,
}: {
    service: ServiceData;
    enterprises: { id: number; business_name: string }[];
    serviceTypes: { id: number; name: string }[];
}) {
    return (
        <PartnerLayout>
            <Head title={`Edit ${service.name}`} />
            <h1 className="mb-6 text-3xl font-extrabold">Edit {service.name}</h1>
            <ServiceForm
                service={service}
                enterprises={enterprises}
                serviceTypes={serviceTypes}
                submitRoute={route('partner.services.update', service.id)}
            />
        </PartnerLayout>
    );
}
