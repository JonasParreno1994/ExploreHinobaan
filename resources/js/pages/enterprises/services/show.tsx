import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Check, MapPin, Users } from 'lucide-react';
import { FormEvent, useMemo } from 'react';

interface Enterprise {
    slug: string;
    business_name: string;
    address: string;
    barangay: { name: string } | null;
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
    check_in_time: string | null;
    check_out_time: string | null;
    service_type: { name: string } | null;
    images: { id: number; image_url: string; caption: string | null }[];
}

export default function ServiceShow({ enterprise, service }: { enterprise: Enterprise; service: Service }) {
    const form = useForm({
        enterprise_service_id: service.id,
        customer_name: '',
        customer_email: '',
        customer_contact: '',
        quantity: 1,
        number_of_guests: 1,
        check_in: '',
        check_out: '',
        reservation_date: '',
        start_time: '',
        end_time: '',
        purpose: '',
        special_request: '',
    });
    const isRoom = service.service_type?.name.toLowerCase().includes('room') ?? false;
    const needsTime = service.pricing_unit === 'per_hour';
    const estimate = useMemo(() => {
        let units = Number(form.data.quantity);
        if (service.pricing_unit === 'per_person') units = Number(form.data.number_of_guests);
        if (service.pricing_unit === 'per_night' && form.data.check_in && form.data.check_out) {
            units *= Math.max(1, Math.ceil((new Date(form.data.check_out).getTime() - new Date(form.data.check_in).getTime()) / 86400000));
        }
        return Number(service.price) * units;
    }, [form.data.check_in, form.data.check_out, form.data.number_of_guests, form.data.quantity, service.price, service.pricing_unit]);

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
                            <form onSubmit={submit} className="mt-7 space-y-4">
                                <h2 className="text-xl font-bold">Request a reservation</h2>
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
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        min="1"
                                        value={String(form.data.quantity)}
                                        onChange={(value) => form.setData('quantity', Number(value))}
                                        error={form.errors.quantity}
                                    />
                                    <Input
                                        label="Guests"
                                        type="number"
                                        min="1"
                                        value={String(form.data.number_of_guests)}
                                        onChange={(value) => form.setData('number_of_guests', Number(value))}
                                        error={form.errors.number_of_guests}
                                    />
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
                                <button
                                    disabled={form.processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3.5 font-bold text-white disabled:opacity-60"
                                >
                                    <CalendarDays className="size-5" /> Submit Reservation
                                </button>
                            </form>
                        ) : (
                            <p className="mt-6 rounded-xl bg-[#FFF3E6] p-4 text-sm">Contact the enterprise directly to inquire about this service.</p>
                        )}
                    </aside>
                </div>
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
