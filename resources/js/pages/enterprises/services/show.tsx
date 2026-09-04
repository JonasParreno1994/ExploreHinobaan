import { ReviewSection, type PublicReview, type ReviewSummary } from '@/components/reviews/review-section';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Check, MapPin, Users } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

interface Enterprise {
    slug: string;
    business_name: string;
    address: string;
    barangay: { name: string } | null;
    reservation_fee: string | null;
    gcash_qr_url: string | null;
}

interface Service {
    id: number;
    name: string;
    description: string | null;
    price: string;
    pricing_unit: string;
    capacity: number | null;
    quantity: number;
    amenities: string[] | null;
    main_image_url: string | null;
    reservation_required: boolean;
    reservation_mode: string | null;
    pool_type: string | null;
    check_in_time: string | null;
    check_out_time: string | null;
    service_type: { name: string } | null;
    images: { id: number; image_url: string; caption: string | null }[];
    sessions: { id: number; name: string; start_time: string; end_time: string; price: string; capacity: number | null }[];
    reservation_items: {
        service_session_id: number | null;
        quantity: number;
        check_in: string | null;
        check_out: string | null;
        reservation_date: string | null;
        start_time: string | null;
        end_time: string | null;
    }[];
    availabilities: { date: string; available_quantity: number | null; status: string }[];
}

interface Tourist {
    name: string;
    email: string;
    phone: string | null;
    city_municipality: string | null;
    province: string | null;
    country: string | null;
}

export default function ServiceShow({
    enterprise,
    service,
    reviews,
    reviewSummary,
    tourist,
}: {
    enterprise: Enterprise;
    service: Service;
    reviews: PublicReview[];
    reviewSummary: ReviewSummary;
    tourist: Tourist | null;
}) {
    const form = useForm({
        enterprise_service_id: service.id,
        customer_name: tourist?.name ?? '',
        customer_email: tourist?.email ?? '',
        customer_contact: tourist?.phone ?? '',
        customer_address: [tourist?.city_municipality, tourist?.province, tourist?.country].filter(Boolean).join(', '),
        quantity: 1,
        number_of_guests: 1,
        adults: 1,
        children: 0,
        service_session_id: '',
        check_in: '',
        check_out: '',
        reservation_date: '',
        start_time: '',
        end_time: '',
        purpose: '',
        special_request: '',
        payment_proof: null as File | null,
    });
    const [continueMode, setContinueMode] = useState<'guest' | 'account' | null>(tourist ? 'account' : null);
    const reservationReturn =
        typeof window === 'undefined' ? `/enterprises/${enterprise.slug}/services/${service.id}` : `${window.location.pathname}?reserve=1`;
    const isRoom = service.service_type?.name.toLowerCase().includes('room') ?? false;
    const isCottage = service.service_type?.name.toLowerCase().includes('cottage') ?? false;
    const isPool = service.service_type?.name.toLowerCase().includes('pool') ?? false;
    const needsTime = service.reservation_mode === 'timeslot';
    const nights =
        form.data.check_in && form.data.check_out
            ? Math.max(0, Math.ceil((new Date(form.data.check_out).getTime() - new Date(form.data.check_in).getTime()) / 86400000))
            : 0;
    const totalGuests = Number(form.data.adults) + Number(form.data.children);
    const selectedSession = service.sessions.find((session) => String(session.id) === form.data.service_session_id);
    const reservedQuantity = useMemo(
        () =>
            service.reservation_items
                .filter((item) => {
                    if (isRoom && form.data.check_in && form.data.check_out)
                        return Boolean(item.check_in && item.check_out && item.check_in < form.data.check_out && item.check_out > form.data.check_in);
                    if (form.data.reservation_date && item.reservation_date === form.data.reservation_date) {
                        if (form.data.service_session_id) return String(item.service_session_id) === form.data.service_session_id;
                        if (needsTime && form.data.start_time && form.data.end_time)
                            return Boolean(
                                item.start_time && item.end_time && item.start_time < form.data.end_time && item.end_time > form.data.start_time,
                            );
                        return true;
                    }
                    return false;
                })
                .reduce((sum, item) => sum + item.quantity, 0),
        [
            form.data.check_in,
            form.data.check_out,
            form.data.reservation_date,
            form.data.service_session_id,
            form.data.start_time,
            form.data.end_time,
            isRoom,
            needsTime,
            service.reservation_items,
        ],
    );
    const dateAvailability = service.availabilities.find((item) => item.date === (form.data.reservation_date || form.data.check_in));
    const totalInventory = dateAvailability?.available_quantity ?? service.quantity;
    const availableQuantity = ['unavailable', 'maintenance', 'closed'].includes(dateAvailability?.status ?? '')
        ? 0
        : Math.max(0, totalInventory - reservedQuantity);
    const maximumGuests = (selectedSession?.capacity ?? service.capacity ?? 0) * (isPool ? 1 : Number(form.data.quantity));
    const estimate = useMemo(() => {
        let units = Number(form.data.quantity);
        if (service.pricing_unit === 'per_person') units = totalGuests;
        if (service.pricing_unit === 'per_night' && form.data.check_in && form.data.check_out) {
            units *= Math.max(1, Math.ceil((new Date(form.data.check_out).getTime() - new Date(form.data.check_in).getTime()) / 86400000));
        }
        return Number(selectedSession?.price ?? service.price) * units;
    }, [form.data.check_in, form.data.check_out, form.data.quantity, selectedSession, service.price, service.pricing_unit, totalGuests]);

    const formInvalid =
        Number(form.data.quantity) > availableQuantity ||
        (maximumGuests > 0 && totalGuests > maximumGuests) ||
        (isRoom && nights < 1) ||
        (isPool && service.reservation_mode === 'session' && !form.data.service_session_id);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('reservations.store'));
    };

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title={`${service.name} | ${enterprise.business_name}`} />
            <main className="mx-auto max-w-7xl px-5 py-10">
                <Link href={route('enterprises.show', enterprise.slug)} className="inline-flex items-center gap-2 font-semibold text-[#0F766E]">
                    <ArrowLeft className="size-4" /> Back to {enterprise.business_name}
                </Link>
                <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
                    <div>
                        <img
                            src={service.main_image_url ?? '/images/landing/hinobaan-hero.png'}
                            alt={service.name}
                            className="h-[420px] w-full rounded-3xl object-cover"
                        />
                        <p className="mt-7 text-sm font-bold text-[#0F766E]">{service.service_type?.name ?? 'Service'}</p>
                        <h1 className="mt-2 text-4xl font-extrabold">{service.name}</h1>
                        <p className="mt-3 flex items-center gap-2 text-[#64748B]">
                            <MapPin className="size-5" /> {enterprise.address}
                        </p>
                        <p className="mt-7 leading-8 whitespace-pre-line text-[#64748B]">
                            {service.description || 'More details will be available soon.'}
                        </p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            {(service.amenities ?? []).map((amenity) => (
                                <span key={amenity} className="flex items-center gap-2 rounded-xl bg-white p-3">
                                    <Check className="size-4 text-[#0F766E]" />
                                    {amenity}
                                </span>
                            ))}
                        </div>
                        {service.images.length > 0 && (
                            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {service.images.map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.image_url}
                                        alt={image.caption ?? service.name}
                                        className="aspect-square w-full rounded-2xl object-cover"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <aside className="h-fit rounded-3xl bg-white p-6 shadow-lg lg:sticky lg:top-6">
                        <p className="text-3xl font-extrabold text-[#F97316]">
                            ₱{Number(service.price).toLocaleString('en-PH')}{' '}
                            <small className="text-sm text-[#64748B]">/ {service.pricing_unit.replace('per_', '')}</small>
                        </p>
                        <p className="mt-2 flex gap-2 text-sm text-[#64748B]">
                            <Users className="size-4" /> Up to {service.capacity ?? 'unspecified'} guests · {service.quantity} available
                        </p>
                        {service.reservation_required ? (
                            continueMode === null ? (
                                <div className="mt-7 space-y-3">
                                    <h2 className="text-xl font-bold">Continue your reservation</h2>
                                    <p className="text-sm text-slate-500">Choose how you would like to continue. Guest booking remains available.</p>
                                    <Link
                                        href={`/tourist/login?redirect=${encodeURIComponent(reservationReturn)}`}
                                        className="block rounded-xl bg-[#0F766E] p-4 text-center font-bold text-white"
                                    >
                                        Tourist Login
                                        <span className="mt-1 block text-xs font-normal text-teal-50">
                                            Manage reservations and use saved information.
                                        </span>
                                    </Link>
                                    <Link
                                        href={`/tourist/register?redirect=${encodeURIComponent(reservationReturn)}`}
                                        className="block rounded-xl border border-[#F97316] p-4 text-center font-bold text-[#C2410C]"
                                    >
                                        Create Account
                                        <span className="mt-1 block text-xs font-normal text-slate-500">Create a verified tourist profile.</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setContinueMode('guest')}
                                        className="w-full rounded-xl border border-slate-300 p-4 font-bold"
                                    >
                                        Continue as Guest
                                        <span className="mt-1 block text-xs font-normal text-slate-500">Reserve without creating an account.</span>
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="mt-7 space-y-4">
                                    <h2 className="text-xl font-bold">Request a reservation</h2>
                                    {continueMode === 'account' && (
                                        <p className="rounded-xl bg-teal-50 p-3 text-sm font-semibold text-[#0F766E]">
                                            Booking with your registered tourist account.
                                        </p>
                                    )}
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Input
                                            label="Full name"
                                            value={form.data.customer_name}
                                            onChange={(value) => form.setData('customer_name', value)}
                                            error={form.errors.customer_name}
                                        />
                                        <Input
                                            label="Contact number"
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
                                    <Input
                                        label="Address / City (optional)"
                                        value={form.data.customer_address}
                                        onChange={(value) => form.setData('customer_address', value)}
                                        error={form.errors.customer_address}
                                    />
                                    {isRoom ? (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <Input
                                                label="Check-in"
                                                type="date"
                                                value={form.data.check_in}
                                                onChange={(value) => form.setData('check_in', value)}
                                                error={form.errors.check_in}
                                            />
                                            <Input
                                                label="Check-out"
                                                type="date"
                                                value={form.data.check_out}
                                                onChange={(value) => form.setData('check_out', value)}
                                                error={form.errors.check_out}
                                            />
                                        </div>
                                    ) : (
                                        <Input
                                            label="Reservation date"
                                            type="date"
                                            value={form.data.reservation_date}
                                            onChange={(value) => form.setData('reservation_date', value)}
                                            error={form.errors.reservation_date}
                                        />
                                    )}
                                    {needsTime && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Start time"
                                                type="time"
                                                value={form.data.start_time}
                                                onChange={(value) => form.setData('start_time', value)}
                                                error={form.errors.start_time}
                                            />
                                            <Input
                                                label="End time"
                                                type="time"
                                                value={form.data.end_time}
                                                onChange={(value) => form.setData('end_time', value)}
                                                error={form.errors.end_time}
                                            />
                                        </div>
                                    )}
                                    {isPool && service.reservation_mode === 'session' && (
                                        <div>
                                            <p className="mb-2 text-sm font-semibold">Available session</p>
                                            <div className="grid gap-2">
                                                {service.sessions.map((session) => {
                                                    const booked = service.reservation_items.some(
                                                        (item) =>
                                                            item.reservation_date === form.data.reservation_date &&
                                                            item.service_session_id === session.id,
                                                    );
                                                    return (
                                                        <button
                                                            key={session.id}
                                                            type="button"
                                                            disabled={!form.data.reservation_date || booked}
                                                            onClick={() => form.setData('service_session_id', String(session.id))}
                                                            className={`rounded-xl border p-3 text-left ${form.data.service_session_id === String(session.id) ? 'border-[#F97316] bg-orange-50' : 'border-slate-200'} disabled:bg-slate-100 disabled:text-slate-400`}
                                                        >
                                                            <strong>{session.name}</strong>
                                                            <span className="block text-xs">
                                                                {session.start_time.slice(0, 5)} – {session.end_time.slice(0, 5)} ·{' '}
                                                                {booked ? 'Booked' : `₱${Number(session.price).toLocaleString('en-PH')}`}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {form.errors.service_session_id && (
                                                <small className="text-red-600">{form.errors.service_session_id}</small>
                                            )}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label={isRoom ? 'Number of rooms' : isCottage ? 'Number of cottages' : 'Quantity'}
                                            type="number"
                                            min="1"
                                            value={String(form.data.quantity)}
                                            onChange={(value) => form.setData('quantity', Number(value))}
                                            error={form.errors.quantity}
                                        />
                                        <Input
                                            label="Adults"
                                            type="number"
                                            min="1"
                                            value={String(form.data.adults)}
                                            onChange={(value) => form.setData('adults', Number(value))}
                                            error={form.errors.adults}
                                        />
                                        <Input
                                            label="Children"
                                            type="number"
                                            min="0"
                                            value={String(form.data.children)}
                                            onChange={(value) => form.setData('children', Number(value))}
                                            error={form.errors.children}
                                        />
                                    </div>
                                    <div className="rounded-xl border border-teal-100 bg-teal-50 p-3 text-sm">
                                        <p>
                                            <strong>{availableQuantity}</strong> {isRoom ? 'room(s)' : isCottage ? 'cottage(s)' : 'unit(s)'} available
                                            for this schedule
                                        </p>
                                        {isRoom && (
                                            <p>
                                                {nights} night(s) · maximum {maximumGuests || 'unspecified'} guests
                                            </p>
                                        )}
                                        <p>{totalGuests} total guest(s)</p>
                                        {Number(form.data.quantity) > availableQuantity && (
                                            <p className="mt-1 font-bold text-red-600">Only {availableQuantity} unit(s) are available.</p>
                                        )}
                                        {maximumGuests > 0 && totalGuests > maximumGuests && (
                                            <p className="mt-1 font-bold text-red-600">
                                                This selection can accommodate a maximum of {maximumGuests} guests.
                                            </p>
                                        )}
                                    </div>
                                    <label className="block text-sm font-semibold">
                                        Special requests
                                        <textarea
                                            value={form.data.special_request}
                                            onChange={(event) => form.setData('special_request', event.target.value)}
                                            className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 p-3 font-normal"
                                        />
                                    </label>
                                    <div className="rounded-2xl bg-[#FFF3E6] p-4">
                                        <span className="text-sm text-[#64748B]">Estimated total</span>
                                        <strong className="block text-2xl text-[#C2410C]">₱{estimate.toLocaleString('en-PH')}</strong>
                                        <small>The final total is securely recalculated when submitted.</small>
                                    </div>
                                    {Number(enterprise.reservation_fee ?? 0) > 0 && (
                                        <div className="rounded-2xl border border-teal-200 p-4">
                                            <h3 className="font-bold text-[#0F766E]">
                                                Pay reservation fee: ₱{Number(enterprise.reservation_fee).toLocaleString('en-PH')}
                                            </h3>
                                            {enterprise.gcash_qr_url && (
                                                <img
                                                    src={enterprise.gcash_qr_url}
                                                    alt="Enterprise GCash QR code"
                                                    className="mx-auto my-3 size-48 object-contain"
                                                />
                                            )}
                                            <label className="text-sm font-semibold">
                                                Upload GCash payment proof
                                                <input
                                                    type="file"
                                                    required
                                                    accept="image/*"
                                                    onChange={(e) => form.setData('payment_proof', e.target.files?.[0] ?? null)}
                                                    className="mt-2 block w-full text-xs"
                                                />
                                            </label>
                                            {form.errors.payment_proof && <small className="text-red-600">{form.errors.payment_proof}</small>}
                                            <p className="mt-2 text-xs text-[#64748B]">
                                                Your request remains pending until the enterprise verifies this payment.
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        disabled={form.processing || formInvalid}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3.5 font-bold text-white disabled:opacity-60"
                                    >
                                        <CalendarDays className="size-5" /> Submit Reservation
                                    </button>
                                </form>
                            )
                        ) : (
                            <p className="mt-6 rounded-xl bg-[#FFF3E6] p-4 text-sm">Contact the enterprise directly to inquire about this service.</p>
                        )}
                    </aside>
                </div>
                <ReviewSection targetType="service" targetId={service.id} reviews={reviews} summary={reviewSummary} />
            </main>
        </div>
    );
}

function Input({
    label,
    error,
    onChange,
    ...props
}: { label: string; error?: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    return (
        <label className="block text-sm font-semibold">
            {label}
            <input
                {...props}
                onChange={(event) => onChange(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal"
            />
            {error && <small className="mt-1 block text-red-600">{error}</small>}
        </label>
    );
}
