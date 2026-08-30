import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import ProductForm from '@/components/tourism-enterprise/product-form';
import { Head } from '@inertiajs/react';
export default function Create({ enterprises, categories }: any) {
    return (
        <PartnerLayout>
            <Head title="Add Local Product" />
            <h1 className="mb-6 text-3xl font-extrabold">Add Local Product</h1>
            <ProductForm enterprises={enterprises} categories={categories} />
        </PartnerLayout>
    );
}
