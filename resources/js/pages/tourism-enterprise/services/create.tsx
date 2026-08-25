import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import ServiceForm from '@/components/tourism-enterprise/service-form';
import { Head } from '@inertiajs/react';
export default function Create({
    enterprises,
    serviceTypes,
}: {
    enterprises: { id: number; business_name: string }[];
    serviceTypes: { id: number; name: string }[];
}) {
    return (
        <PartnerLayout>
            <Head title="Add Service" />
            <h1 className="mb-6 text-3xl font-extrabold">Add Service or Facility</h1>
            <ServiceForm enterprises={enterprises} serviceTypes={serviceTypes} submitRoute={route('partner.services.store')} />
        </PartnerLayout>
    );
}
