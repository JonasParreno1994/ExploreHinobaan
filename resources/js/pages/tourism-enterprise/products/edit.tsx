import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import ProductForm from '@/components/tourism-enterprise/product-form';
import { Head } from '@inertiajs/react';
export default function Edit({ enterprises, categories, product }: any) {
    return (
        <PartnerLayout>
            <Head title="Edit Local Product" />
            <h1 className="mb-6 text-3xl font-extrabold">Edit Local Product</h1>
            <ProductForm enterprises={enterprises} categories={categories} product={product} />
        </PartnerLayout>
    );
}
