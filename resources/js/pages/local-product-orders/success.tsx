import { BackToLanding } from '@/components/back-to-landing';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
export default function Success({ order }: any) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBF5] p-5">
            <Head title="Order submitted" />
            <main className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
                <CheckCircle2 className="mx-auto size-16 text-[#0F766E]" />
                <h1 className="mt-4 text-3xl font-extrabold">Order Submitted</h1>
                <p className="mt-2">Your order was sent to {order.enterprise.business_name}.</p>
                <div className="mt-6 rounded-2xl bg-[#FFF3E6] p-5 text-left">
                    <p>
                        <b>Order number:</b> {order.order_number}
                    </p>
                    <p>
                        <b>Product:</b> {order.items[0]?.product_name}
                    </p>
                    <p>
                        <b>Total:</b> ₱{Number(order.total_amount).toLocaleString()}
                    </p>
                    <p>
                        <b>Status:</b> Pending producer review
                    </p>
                </div>
                <div className="mt-6 flex justify-center gap-3">
                    <Link href={route('local-products.index')} className="rounded-xl bg-[#F97316] px-5 py-3 font-bold text-white">
                        Continue Shopping
                    </Link>
                    <BackToLanding compact />
                </div>
            </main>
        </div>
    );
}
