import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, FileText, MapPin, Phone, Wrench } from 'lucide-react';
import { FormEvent } from 'react';

interface Enterprise {
    id: number;
    slug: string;
    business_name: string;
    contact_person: string;
    email: string;
    phone: string | null;
    description: string | null;
    address: string;
    license_number: string | null;
    application_status: string;
    logo_url: string | null;
    cover_image_url: string | null;
    documents_count: number;
    services_count: number;
    reservations_count: number;
    enterprise_type: { name: string } | null;
    reservation_fee: string | null;
    gcash_qr_url: string | null;
    order_setting: {
        accepts_pickup: boolean;
        accepts_delivery: boolean;
        delivery_fee: string;
        minimum_order_amount: string | null;
        accepts_cash_on_pickup: boolean;
        accepts_gcash: boolean;
        estimated_preparation_days: number | null;
        allows_order_cancellation: boolean;
        cancellation_window_hours: number | null;
        allows_refunds: boolean;
        refund_window_days: number | null;
    } | null;
}

export default function EnterpriseIndex({ enterprises }: { enterprises: Enterprise[] }) {
    return (
        <PartnerLayout>
            <Head title="My Enterprises" />
            <p className="text-xs font-bold tracking-widest text-[#F97316] uppercase">Business profile</p>
            <h1 className="mt-2 text-3xl font-extrabold">My Enterprises</h1>
            <p className="mt-2 text-[#64748B]">Review the enterprise information connected to your partner account.</p>
            <div className="mt-7 grid gap-6">
                {enterprises.map((enterprise) => (
                    <article key={enterprise.id} className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                        <div className="grid lg:grid-cols-[300px_1fr]">
                            <div className="relative min-h-64 bg-[#FFF3E6]">
                                <img
                                    src={enterprise.cover_image_url ?? '/images/landing/hinobaan-hero.png'}
                                    alt={enterprise.business_name}
                                    className="absolute inset-0 size-full object-cover"
                                />
                                {enterprise.logo_url && (
                                    <img
                                        src={enterprise.logo_url}
                                        alt=""
                                        className="absolute bottom-5 left-5 size-20 rounded-2xl border-4 border-white bg-white object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-7">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-bold text-[#0F766E]">
                                            {enterprise.enterprise_type?.name ?? 'Tourism Enterprise'}
                                        </span>
                                        <h2 className="mt-1 text-2xl font-extrabold">{enterprise.business_name}</h2>
                                    </div>
                                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0F766E] capitalize">
                                        {enterprise.application_status}
                                    </span>
                                </div>
                                <p className="mt-4 flex gap-2 text-sm text-[#64748B]">
                                    <MapPin className="size-4 shrink-0 text-[#F97316]" />
                                    {enterprise.address}
                                </p>
                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#64748B]">
                                    {enterprise.description || 'No description supplied.'}
                                </p>
                                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                                    <p>
                                        <strong>Contact person:</strong> {enterprise.contact_person}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {enterprise.email}
                                    </p>
                                    <p className="flex gap-2">
                                        <Phone className="size-4" />
                                        {enterprise.phone || 'Not available'}
                                    </p>
                                    <p>
                                        <strong>License:</strong> {enterprise.license_number || 'Not available'}
                                    </p>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={route('partner.services.index')}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-bold text-white"
                                    >
                                        <Wrench className="size-4" />
                                        {enterprise.services_count} Services
                                    </Link>
                                    <Link
                                        href={route('partner.documents.index')}
                                        className="inline-flex items-center gap-2 rounded-xl border border-[#0F766E] px-4 py-2.5 text-sm font-bold text-[#0F766E]"
                                    >
                                        <FileText className="size-4" />
                                        {enterprise.documents_count} Documents
                                    </Link>
                                    {enterprise.application_status === 'approved' && (
                                        <Link
                                            href={route('enterprises.show', enterprise.slug)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-bold text-[#F97316]"
                                        >
                                            <Building2 className="size-4" />
                                            Public Profile
                                        </Link>
                                    )}
                                </div>
                                <PaymentSettings enterprise={enterprise} />
                                <CommerceSettings enterprise={enterprise} />
                            </div>
                        </div>
                    </article>
                ))}
                {enterprises.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-12 text-center text-[#64748B]">
                        No enterprise is connected to this account.
                    </div>
                )}
            </div>
        </PartnerLayout>
    );
}

function CommerceSettings({ enterprise }: { enterprise: Enterprise }) {
    const setting = enterprise.order_setting;
    const form = useForm({
        accepts_pickup: setting?.accepts_pickup ?? true,
        accepts_delivery: setting?.accepts_delivery ?? false,
        delivery_fee: setting?.delivery_fee ?? '0',
        minimum_order_amount: setting?.minimum_order_amount ?? '',
        accepts_cash_on_pickup: setting?.accepts_cash_on_pickup ?? true,
        accepts_gcash: setting?.accepts_gcash ?? false,
        estimated_preparation_days: setting?.estimated_preparation_days ?? '',
        allows_order_cancellation: setting?.allows_order_cancellation ?? true,
        cancellation_window_hours: setting?.cancellation_window_hours ?? 24,
        allows_refunds: setting?.allows_refunds ?? false,
        refund_window_days: setting?.refund_window_days ?? 7,
    });
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.post(route('partner.enterprises.commerce-settings', enterprise.id), { preserveScroll: true });
            }}
            className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-4"
        >
            <h3 className="font-extrabold text-[#0F766E]">Local Product Order Settings</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex gap-2 text-sm font-semibold">
                    <input type="checkbox" checked={form.data.accepts_pickup} onChange={(e) => form.setData('accepts_pickup', e.target.checked)} />{' '}
                    Accept pickup
                </label>
                <label className="flex gap-2 text-sm font-semibold">
                    <input
                        type="checkbox"
                        checked={form.data.accepts_delivery}
                        onChange={(e) => form.setData('accepts_delivery', e.target.checked)}
                    />{' '}
                    Accept delivery
                </label>
                <label className="flex gap-2 text-sm font-semibold">
                    <input
                        type="checkbox"
                        checked={form.data.accepts_cash_on_pickup}
                        onChange={(e) => form.setData('accepts_cash_on_pickup', e.target.checked)}
                    />{' '}
                    Cash on pickup
                </label>
                <label className="flex gap-2 text-sm font-semibold">
                    <input type="checkbox" checked={form.data.accepts_gcash} onChange={(e) => form.setData('accepts_gcash', e.target.checked)} />{' '}
                    Accept GCash
                </label>
                <label className="flex gap-2 text-sm font-semibold">
                    <input type="checkbox" checked={form.data.allows_order_cancellation} onChange={(e) => form.setData('allows_order_cancellation', e.target.checked)} />{' '}
                    Allow order cancellation
                </label>
                <label className="flex gap-2 text-sm font-semibold">
                    <input type="checkbox" checked={form.data.allows_refunds} onChange={(e) => form.setData('allows_refunds', e.target.checked)} />{' '}
                    Allow refunds
                </label>
                <label className="text-sm font-semibold">
                    Delivery fee
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.data.delivery_fee}
                        onChange={(e) => form.setData('delivery_fee', e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border bg-white px-3"
                    />
                </label>
                <label className="text-sm font-semibold">
                    Minimum order amount
                    <input type="number" min="0" step="0.01" value={form.data.minimum_order_amount} onChange={(e) => form.setData('minimum_order_amount', e.target.value)} className="mt-1 h-10 w-full rounded-lg border bg-white px-3" />
                </label>
                <label className="text-sm font-semibold">
                    Preparation days
                    <input
                        type="number"
                        min="0"
                        value={form.data.estimated_preparation_days}
                        onChange={(e) => form.setData('estimated_preparation_days', e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border bg-white px-3"
                    />
                </label>
                <label className="text-sm font-semibold">
                    Cancellation window (hours)
                    <input type="number" min="1" value={form.data.cancellation_window_hours} disabled={!form.data.allows_order_cancellation} onChange={(e) => form.setData('cancellation_window_hours', e.target.value)} className="mt-1 h-10 w-full rounded-lg border bg-white px-3 disabled:opacity-50" />
                </label>
                <label className="text-sm font-semibold">
                    Refund window (days)
                    <input type="number" min="1" value={form.data.refund_window_days} disabled={!form.data.allows_refunds} onChange={(e) => form.setData('refund_window_days', e.target.value)} className="mt-1 h-10 w-full rounded-lg border bg-white px-3 disabled:opacity-50" />
                </label>
            </div>
            {Object.values(form.errors).map((error) => <p key={error} className="mt-2 text-sm font-semibold text-red-600">{error}</p>)}
            <button disabled={form.processing} className="mt-3 rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-bold text-white">
                Save order settings
            </button>
        </form>
    );
}

function PaymentSettings({ enterprise }: { enterprise: Enterprise }) {
    const form = useForm({ reservation_fee: enterprise.reservation_fee ?? '', gcash_qr: null as File | null });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('partner.enterprises.payment-settings', enterprise.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.reset('gcash_qr'),
        });
    };
    return (
        <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl bg-[#FFF3E6] p-4 sm:grid-cols-[1fr_1fr_auto]">
            <label className="text-sm font-bold">
                Reservation fee (optional)
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.data.reservation_fee}
                    onChange={(e) => form.setData('reservation_fee', e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border bg-white px-3 font-normal"
                />
                {form.errors.reservation_fee && <span className="mt-1 block text-xs font-medium text-red-600">{form.errors.reservation_fee}</span>}
            </label>
            <label className="text-sm font-bold">
                GCash QR (optional)
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => form.setData('gcash_qr', e.target.files?.[0] ?? null)}
                    className="mt-1 block w-full text-xs"
                />
                <span className="mt-1 block text-xs font-normal text-[#64748B]">JPG, PNG, or WebP up to 5 MB.</span>
                {form.errors.gcash_qr && <span className="mt-1 block text-xs font-medium text-red-600">{form.errors.gcash_qr}</span>}
            </label>
            <button disabled={form.processing} className="self-end rounded-lg bg-[#0F766E] px-4 py-3 text-sm font-bold text-white">
                {form.processing ? 'Saving...' : 'Save payment settings'}
            </button>
            {form.recentlySuccessful && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 sm:col-span-3">
                    Reservation fee and GCash QR saved successfully.
                </p>
            )}
            {enterprise.gcash_qr_url && (
                <div className="sm:col-span-3">
                    <p className="mb-2 text-xs font-semibold text-[#64748B]">Current GCash QR</p>
                    <img src={enterprise.gcash_qr_url} alt="GCash QR" className="size-28 rounded-xl bg-white object-contain p-2" />
                </div>
            )}
        </form>
    );
}
