import { BackToLanding } from '@/components/back-to-landing';
import { ReviewSection } from '@/components/reviews/review-section';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin, PackageCheck, ShoppingBag, ShoppingCart } from 'lucide-react';
import { FormEvent, ReactNode } from 'react';

export default function Show({ product, orderSetting, reviews, reviewSummary }: any) {
    const canOrder = orderSetting.accepts_pickup || orderSetting.accepts_delivery;
    const hasPaymentMethod = orderSetting.accepts_cash_on_pickup || orderSetting.accepts_gcash;
    const form = useForm({
        product_id: product.id,
        quantity: 1,
        customer_name: '',
        customer_email: '',
        customer_contact: '',
        fulfillment_method: orderSetting.accepts_pickup ? 'pickup' : 'delivery',
        delivery_address: '',
        payment_method: orderSetting.accepts_cash_on_pickup ? 'cash_on_pickup' : 'gcash',
        payment_proof: null as File | null,
        customer_notes: '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('local-product-orders.store'), { forceFormData: true });
    };
    const total =
        Number(product.price) * Number(form.data.quantity) + (form.data.fulfillment_method === 'delivery' ? Number(orderSetting.delivery_fee) : 0);

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title={product.name} />
            <header className="border-b border-orange-100 bg-white px-4 py-4 sm:px-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
                    <Link href={route('local-products.index')} className="flex items-center gap-3 font-extrabold text-[#1F2937]">
                        <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-[#F97316]">
                            <ShoppingBag className="size-5" />
                        </span>
                        <span className="hidden sm:inline">Hinoba-an Local Products</span>
                    </Link>
                    <BackToLanding compact />
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
                <Link
                    href={route('local-products.index')}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] hover:underline"
                >
                    <ArrowLeft className="size-4" /> Back to local products
                </Link>
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)]">
                    <section className="min-w-0">
                        <img
                            src={product.main_image_url ?? '/images/tourism-placeholder.svg'}
                            alt={product.name}
                            className="aspect-[4/3] w-full rounded-2xl object-cover sm:rounded-3xl lg:aspect-[16/10]"
                        />
                        {product.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                                {product.images.map((image: any) => (
                                    <img
                                        key={image.id}
                                        src={image.image_url}
                                        alt={image.caption ?? product.name}
                                        className="aspect-square w-full rounded-xl object-cover"
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                        )}
                        <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-5 sm:mt-8 sm:rounded-3xl sm:p-7">
                            <span className="text-sm font-bold text-[#0F766E]">{product.category.name}</span>
                            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
                            <p className="mt-3 flex items-start gap-2 text-sm text-[#64748B] sm:text-base">
                                <MapPin className="mt-0.5 size-5 shrink-0" />
                                {product.enterprise.business_name} · {product.enterprise.address}
                            </p>
                            <p className="mt-6 leading-7 whitespace-pre-line">{product.description}</p>
                        </div>
                    </section>

                    <aside className="h-fit rounded-2xl border border-orange-100 bg-white p-5 shadow-lg sm:rounded-3xl sm:p-6 lg:sticky lg:top-6">
                        <p className="text-3xl font-extrabold text-[#F97316]">
                            ₱{Number(product.price).toLocaleString('en-PH')}{' '}
                            <small className="text-sm font-medium text-[#64748B]">/ {product.selling_unit}</small>
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#64748B]">
                            <PackageCheck className="size-4 text-[#0F766E]" />
                            {product.is_made_to_order ? 'Made to order' : `${product.stock_quantity} available`}
                        </p>
                        <form onSubmit={submit} className="mt-6 grid gap-5">
                            <fieldset className="grid gap-3">
                                <legend className="mb-3 text-base font-extrabold">Order details</legend>
                                <Input
                                    label="Quantity"
                                    type="number"
                                    value={String(form.data.quantity)}
                                    onChange={(value) => form.setData('quantity', Number(value))}
                                    error={form.errors.quantity}
                                />
                            </fieldset>
                            <fieldset className="grid gap-3 border-t border-slate-100 pt-5">
                                <legend className="mb-3 text-base font-extrabold">Customer information</legend>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    <Input
                                        label="Full name"
                                        value={form.data.customer_name}
                                        onChange={(value) => form.setData('customer_name', value)}
                                        error={form.errors.customer_name}
                                    />
                                    <Input
                                        label="Contact number"
                                        type="tel"
                                        value={form.data.customer_contact}
                                        onChange={(value) => form.setData('customer_contact', value)}
                                        error={form.errors.customer_contact}
                                    />
                                </div>
                                <Input
                                    label="Email"
                                    type="email"
                                    value={form.data.customer_email}
                                    onChange={(value) => form.setData('customer_email', value)}
                                    error={form.errors.customer_email}
                                />
                            </fieldset>
                            <fieldset className="grid gap-3 border-t border-slate-100 pt-5">
                                <legend className="mb-3 text-base font-extrabold">Fulfillment and payment</legend>
                                <SelectField
                                    label="Fulfillment"
                                    value={form.data.fulfillment_method}
                                    onChange={(value) => form.setData('fulfillment_method', value)}
                                    error={form.errors.fulfillment_method}
                                >
                                    {orderSetting.accepts_pickup && <option value="pickup">Pickup</option>}
                                    {orderSetting.accepts_delivery && (
                                        <option value="delivery">Delivery (+₱{Number(orderSetting.delivery_fee).toLocaleString('en-PH')})</option>
                                    )}
                                </SelectField>
                                {form.data.fulfillment_method === 'delivery' && (
                                    <Input
                                        label="Delivery address"
                                        value={form.data.delivery_address}
                                        onChange={(value) => form.setData('delivery_address', value)}
                                        error={form.errors.delivery_address}
                                    />
                                )}
                                <SelectField
                                    label="Payment"
                                    value={form.data.payment_method}
                                    onChange={(value) => form.setData('payment_method', value)}
                                    error={form.errors.payment_method}
                                >
                                    {orderSetting.accepts_cash_on_pickup && <option value="cash_on_pickup">Cash on pickup</option>}
                                    {orderSetting.accepts_gcash && <option value="gcash">GCash</option>}
                                </SelectField>
                                {form.data.payment_method === 'gcash' && (
                                    <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
                                        {product.enterprise.gcash_qr_url && (
                                            <img
                                                src={product.enterprise.gcash_qr_url}
                                                alt={`${product.enterprise.business_name} GCash QR code`}
                                                className="mx-auto size-40 object-contain"
                                            />
                                        )}
                                        <label className="mt-3 block text-sm font-bold">Payment receipt</label>
                                        <input
                                            required
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(event) => form.setData('payment_proof', event.target.files?.[0] ?? null)}
                                            className="mt-2 block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[#0F766E] file:px-3 file:py-2 file:font-bold file:text-white"
                                        />
                                        {form.errors.payment_proof && <small className="mt-1 block text-red-600">{form.errors.payment_proof}</small>}
                                    </div>
                                )}
                                <label className="text-sm font-bold">
                                    Order notes <span className="font-normal text-[#64748B]">(optional)</span>
                                    <textarea
                                        value={form.data.customer_notes}
                                        onChange={(event) => form.setData('customer_notes', event.target.value)}
                                        rows={3}
                                        className="mt-1 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
                                        placeholder="Add preparation or pickup instructions"
                                    />
                                    {form.errors.customer_notes && <small className="mt-1 block text-red-600">{form.errors.customer_notes}</small>}
                                </label>
                            </fieldset>
                            {(!canOrder || !hasPaymentMethod) && (
                                <p className="rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                                    Online ordering is not configured for this product yet. Please contact the seller directly.
                                </p>
                            )}
                            <div className="rounded-xl bg-[#FFF3E6] p-4">
                                <small className="font-semibold text-[#64748B]">Order total</small>
                                <strong className="block text-2xl">₱{total.toLocaleString('en-PH')}</strong>
                            </div>
                            <button
                                disabled={form.processing || !canOrder || !hasPaymentMethod}
                                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F97316] p-3 font-bold text-white transition hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ShoppingCart className="size-5" />
                                {form.processing ? 'Placing order…' : 'Place Order'}
                            </button>
                        </form>
                    </aside>
                </div>
                <div className="mt-8">
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
    onChange: (value: string) => void;
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
                onChange={(event) => onChange(event.target.value)}
                required
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            />
            {error && <small className="mt-1 block text-red-600">{error}</small>}
        </label>
    );
}

function SelectField({
    label,
    value,
    onChange,
    error,
    children,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    children: ReactNode;
}) {
    return (
        <label className="text-sm font-bold">
            {label}
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            >
                {children}
            </select>
            {error && <small className="mt-1 block text-red-600">{error}</small>}
        </label>
    );
}
