import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, router } from '@inertiajs/react';
export default function Show({ order }: any) {
    const update = (data: any) => router.patch(route('partner.product-orders.update', order.id), data);
    return (
        <PartnerLayout>
            <Head title={order.order_number} />
            <article className="rounded-3xl border bg-white p-7 shadow-sm">
                <span className="font-bold text-[#F97316]">PRODUCT ORDER</span>
                <h1 className="text-3xl font-extrabold">{order.order_number}</h1>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <Info label="Customer" value={order.customer_name} />
                    <Info label="Contact" value={`${order.customer_contact} · ${order.customer_email}`} />
                    <Info label="Product" value={`${order.items[0]?.product_name} × ${order.items[0]?.quantity}`} />
                    <Info label="Fulfillment" value={order.fulfillment_method} />
                    <Info label="Total" value={`₱${Number(order.total_amount).toLocaleString()}`} />
                    <Info label="Status" value={order.status.replaceAll('_', ' ')} />
                </div>
                {order.payment_proof_url && (
                    <div className="mt-6 rounded-2xl border p-4">
                        <b>Payment proof</b>
                        <img src={order.payment_proof_url} className="mt-3 max-h-72 rounded-xl" />
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => update({ payment_status: 'verified' })}
                                className="rounded-xl bg-[#0F766E] px-4 py-2 font-bold text-white"
                            >
                                Verify Payment
                            </button>
                            <button
                                onClick={() => update({ payment_status: 'rejected' })}
                                className="rounded-xl border px-4 py-2 font-bold text-red-600"
                            >
                                Reject Payment
                            </button>
                        </div>
                    </div>
                )}
                <div className="mt-7 flex flex-wrap gap-2">
                    {['accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'completed', 'cancelled'].map((status) => (
                        <button key={status} onClick={() => update({ status })} className="rounded-xl border px-4 py-2 text-sm font-bold capitalize">
                            {status.replaceAll('_', ' ')}
                        </button>
                    ))}
                </div>
            </article>
        </PartnerLayout>
    );
}
function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <small className="font-bold text-slate-500">{label}</small>
            <p className="font-semibold capitalize">{value}</p>
        </div>
    );
}
