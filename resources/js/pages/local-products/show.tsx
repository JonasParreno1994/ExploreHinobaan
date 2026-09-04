import { BackToLanding } from '@/components/back-to-landing';
import { ReviewSection } from '@/components/reviews/review-section';
import { Head, useForm } from '@inertiajs/react';
import { MapPin, ShoppingCart } from 'lucide-react';
import { FormEvent } from 'react';
export default function Show({ product, orderSetting, reviews, reviewSummary }: any) {
    const form = useForm({
        product_id: product.id,
        quantity: 1,
        customer_name: '',
        customer_email: '',
        customer_contact: '',
        fulfillment_method: 'pickup',
        delivery_address: '',
        payment_method: 'cash_on_pickup',
        payment_proof: null as File | null,
        customer_notes: '',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route('local-product-orders.store'), { forceFormData: true });
    };
    const total =
        Number(product.price) * Number(form.data.quantity) + (form.data.fulfillment_method === 'delivery' ? Number(orderSetting.delivery_fee) : 0);
    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title={product.name} />
            <header className="border-b bg-white px-5 py-4">
                <div className="mx-auto flex max-w-7xl justify-end">
                    <BackToLanding />
                </div>
            </header>
            <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.3fr_.7fr]">
                <section>
                    <img src={product.main_image_url ?? '/images/tourism-placeholder.svg'} className="h-[430px] w-full rounded-3xl object-cover" />
                    <div className="mt-5 grid grid-cols-3 gap-3">
                        {product.images.map((image: any) => (
                            <img key={image.id} src={image.image_url} className="h-32 w-full rounded-xl object-cover" />
                        ))}
                    </div>
                    <div className="mt-8 rounded-3xl bg-white p-7">
                        <span className="font-bold text-[#0F766E]">{product.category.name}</span>
                        <h1 className="mt-2 text-4xl font-extrabold">{product.name}</h1>
                        <p className="mt-3 flex gap-2 text-[#64748B]">
                            <MapPin className="size-5" /> {product.enterprise.business_name} · {product.enterprise.address}
                        </p>
                        <p className="mt-6 leading-7 whitespace-pre-line">{product.description}</p>
                    </div>
                </section>
                <aside className="h-fit rounded-3xl bg-white p-6 shadow-xl lg:sticky lg:top-6">
                    <p className="text-3xl font-extrabold text-[#F97316]">
                        ₱{Number(product.price).toLocaleString()} <small className="text-sm text-[#64748B]">/ {product.selling_unit}</small>
                    </p>
                    <p className="mt-1 text-sm">{product.is_made_to_order ? 'Made to order' : `${product.stock_quantity} available`}</p>
                    <form onSubmit={submit} className="mt-6 grid gap-3">
                        <Input
                            label="Quantity"
                            type="number"
                            value={String(form.data.quantity)}
                            onChange={(v) => form.setData('quantity', Number(v))}
                            error={form.errors.quantity}
                        />
                        <Input
                            label="Full name"
                            value={form.data.customer_name}
                            onChange={(v) => form.setData('customer_name', v)}
                            error={form.errors.customer_name}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={form.data.customer_email}
                            onChange={(v) => form.setData('customer_email', v)}
                            error={form.errors.customer_email}
                        />
                        <Input
                            label="Contact number"
                            value={form.data.customer_contact}
                            onChange={(v) => form.setData('customer_contact', v)}
                            error={form.errors.customer_contact}
                        />
                        <label className="text-sm font-bold">
                            Fulfillment
                            <select
                                value={form.data.fulfillment_method}
                                onChange={(e) => form.setData('fulfillment_method', e.target.value)}
                                className="mt-1 h-11 w-full rounded-xl border px-3"
                            >
                                <option value="pickup">Pickup</option>
                                {orderSetting.accepts_delivery && (
                                    <option value="delivery">Delivery (+₱{Number(orderSetting.delivery_fee).toLocaleString()})</option>
                                )}
                            </select>
                        </label>
                        {form.data.fulfillment_method === 'delivery' && (
                            <Input
                                label="Delivery address"
                                value={form.data.delivery_address}
                                onChange={(v) => form.setData('delivery_address', v)}
                                error={form.errors.delivery_address}
                            />
                        )}
                        <label className="text-sm font-bold">
                            Payment
                            <select
                                value={form.data.payment_method}
                                onChange={(e) => form.setData('payment_method', e.target.value)}
                                className="mt-1 h-11 w-full rounded-xl border px-3"
                            >
                                {orderSetting.accepts_cash_on_pickup && <option value="cash_on_pickup">Cash on pickup</option>}
                                {orderSetting.accepts_gcash && <option value="gcash">GCash</option>}
                            </select>
                        </label>
                        {form.data.payment_method === 'gcash' && (
                            <div className="rounded-xl bg-teal-50 p-3">
                                {product.enterprise.gcash_qr_url && (
                                    <img src={product.enterprise.gcash_qr_url} className="mx-auto size-40 object-contain" />
                                )}
                                <input
                                    required
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => form.setData('payment_proof', e.target.files?.[0] ?? null)}
                                    className="mt-3 text-xs"
                                />
                            </div>
                        )}
                        <div className="rounded-xl bg-[#FFF3E6] p-4">
                            <small>Total</small>
                            <strong className="block text-2xl">₱{total.toLocaleString()}</strong>
                        </div>
                        <button disabled={form.processing} className="flex justify-center gap-2 rounded-xl bg-[#F97316] p-3 font-bold text-white">
                            <ShoppingCart /> Place Order
                        </button>
                    </form>
                </aside>
                <div className="lg:col-span-2">
                    <ReviewSection targetType="product" targetId={product.id} reviews={reviews} summary={reviewSummary} />
                </div>
            </main>
        </div>
    );
}
function Input({
    label,
    value,
    onChange,
    error,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    type?: string;
}) {
    return (
        <label className="text-sm font-bold">
            {label}
            <input
                type={type}
                min={type === 'number' ? 1 : undefined}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border px-3 font-normal"
            />
            {error && <small className="text-red-600">{error}</small>}
        </label>
    );
}
