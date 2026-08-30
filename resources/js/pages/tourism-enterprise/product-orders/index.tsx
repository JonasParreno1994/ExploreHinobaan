import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, Link } from '@inertiajs/react';
export default function Index({ orders }: any) {
    return (
        <PartnerLayout>
            <Head title="Product Orders" />
            <h1 className="text-3xl font-extrabold">Product Orders</h1>
            <div className="mt-7 overflow-x-auto rounded-3xl border bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left">
                            <th className="p-4">Order #</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.map((o: any) => (
                            <tr key={o.id} className="border-t">
                                <td className="p-4">
                                    <Link className="font-bold text-[#0F766E]" href={route('partner.product-orders.show', o.id)}>
                                        {o.order_number}
                                    </Link>
                                </td>
                                <td>{o.customer_name}</td>
                                <td>{o.items[0]?.product_name}</td>
                                <td>₱{Number(o.total_amount).toLocaleString()}</td>
                                <td className="capitalize">{o.payment_status.replace('_', ' ')}</td>
                                <td className="capitalize">{o.status.replaceAll('_', ' ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PartnerLayout>
    );
}
