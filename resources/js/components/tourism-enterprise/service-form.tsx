import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

interface ServiceSessionData {
    id?: number;
    name: string;
    start_time: string;
    end_time: string;
    price: string;
    capacity: string;
    is_active: boolean;
}

export interface ServiceData {
    id?: number;
    enterprise_id: string;
    service_type_id: string;
    name: string;
    short_description: string;
    description: string;
    price: string;
    pricing_unit: string;
    capacity: string;
    quantity: string;
    amenities: string[];
    reservation_required: boolean;
    reservation_mode: string;
    pool_type: string;
    check_in_time: string;
    check_out_time: string;
    duration_minutes: string;
    status: string;
    main_image?: File | null;
    gallery_images?: File[];
    sessions: ServiceSessionData[];
}
export default function ServiceForm({
    service,
    enterprises,
    serviceTypes,
    submitRoute,
}: {
    service?: Partial<ServiceData>;
    enterprises: { id: number; business_name: string }[];
    serviceTypes: { id: number; name: string }[];
    submitRoute: string;
}) {
    const form = useForm<ServiceData>({
        enterprise_id: String(service?.enterprise_id ?? enterprises[0]?.id ?? ''),
        service_type_id: String(service?.service_type_id ?? ''),
        name: service?.name ?? '',
        short_description: service?.short_description ?? '',
        description: service?.description ?? '',
        price: String(service?.price ?? ''),
        pricing_unit: service?.pricing_unit ?? 'per_night',
        capacity: String(service?.capacity ?? ''),
        quantity: String(service?.quantity ?? 1),
        amenities: service?.amenities ?? [],
        reservation_required: service?.reservation_required ?? true,
        reservation_mode: service?.reservation_mode ?? '',
        pool_type: service?.pool_type ?? '',
        check_in_time: service?.check_in_time?.slice(0, 5) ?? '',
        check_out_time: service?.check_out_time?.slice(0, 5) ?? '',
        duration_minutes: String(service?.duration_minutes ?? ''),
        status: service?.status ?? 'draft',
        main_image: null,
        gallery_images: [],
        sessions: service?.sessions ?? [],
    });
    const selectedType = serviceTypes.find((type) => String(type.id) === form.data.service_type_id)?.name.toLowerCase() ?? '';
    const isRoom = selectedType.includes('room');
    const isCottage = selectedType.includes('cottage');
    const isPool = selectedType.includes('pool');

    function selectServiceType(serviceTypeId: string): void {
        const typeName = serviceTypes.find((type) => String(type.id) === serviceTypeId)?.name.toLowerCase() ?? '';
        form.setData((data) => ({
            ...data,
            service_type_id: serviceTypeId,
            reservation_mode: typeName.includes('room')
                ? 'overnight'
                : typeName.includes('cottage')
                  ? 'day'
                  : typeName.includes('pool')
                    ? 'session'
                    : data.reservation_mode,
            pricing_unit: typeName.includes('room')
                ? 'per_night'
                : typeName.includes('cottage')
                  ? 'per_day'
                  : typeName.includes('pool')
                    ? 'per_session'
                    : data.pricing_unit,
            quantity: typeName.includes('pool') ? '1' : data.quantity,
        }));
    }

    function addSession(): void {
        form.setData('sessions', [
            ...form.data.sessions,
            { name: '', start_time: '', end_time: '', price: form.data.price, capacity: form.data.capacity, is_active: true },
        ]);
    }
    function submit(e: FormEvent) {
        e.preventDefault();
        if (service?.id) {
            form.transform((data) => ({ ...data, _method: 'put' }));
        }

        form.post(submitRoute, { forceFormData: true });
    }
    const field = (key: keyof ServiceData, label: string, type = 'text') => (
        <label className="grid gap-2 text-sm font-bold">
            {label}
            <input
                type={type}
                value={String(form.data[key] ?? '')}
                onChange={(e) => form.setData(key, e.target.value as never)}
                className="h-12 rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-[#F97316]"
            />
            <InputError message={form.errors[key]} />
        </label>
    );
    return (
        <form onSubmit={submit} className="space-y-6 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold">
                    Enterprise
                    <select
                        value={form.data.enterprise_id}
                        onChange={(e) => form.setData('enterprise_id', e.target.value)}
                        className="h-12 rounded-xl border px-4 font-normal"
                    >
                        {enterprises.map((x) => (
                            <option key={x.id} value={x.id}>
                                {x.business_name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="grid gap-2 text-sm font-bold">
                    Service type
                    <select
                        value={form.data.service_type_id}
                        onChange={(e) => selectServiceType(e.target.value)}
                        className="h-12 rounded-xl border px-4 font-normal"
                    >
                        <option value="">Select type</option>
                        {serviceTypes.map((x) => (
                            <option key={x.id} value={x.id}>
                                {x.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={form.errors.service_type_id} />
                </label>
                {field('name', 'Service name')}
                {field('price', 'Price', 'number')}
                {(isRoom || isCottage || isPool) && (
                    <label className="grid gap-2 text-sm font-bold">
                        Reservation mode
                        <select
                            value={form.data.reservation_mode}
                            onChange={(e) => form.setData('reservation_mode', e.target.value)}
                            className="h-12 rounded-xl border px-4 font-normal"
                        >
                            {(isRoom ? ['overnight'] : isCottage ? ['day', 'timeslot'] : ['session', 'day']).map((mode) => (
                                <option key={mode} value={mode}>
                                    {mode[0].toUpperCase() + mode.slice(1)}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                {isPool && (
                    <label className="grid gap-2 text-sm font-bold">
                        Pool type
                        <select
                            value={form.data.pool_type}
                            onChange={(e) => {
                                const poolType = e.target.value;
                                form.setData((data) => ({
                                    ...data,
                                    pool_type: poolType,
                                    reservation_mode: poolType === 'private' ? 'session' : 'day',
                                    pricing_unit: poolType === 'private' ? 'per_session' : 'per_person',
                                    quantity: poolType === 'private' ? '1' : data.quantity,
                                }));
                            }}
                            className="h-12 rounded-xl border px-4 font-normal"
                        >
                            <option value="">Select pool type</option>
                            <option value="private">Private / Exclusive</option>
                            <option value="shared">Shared / Public</option>
                        </select>
                    </label>
                )}
                <label className="grid gap-2 text-sm font-bold">
                    Pricing unit
                    <select
                        value={form.data.pricing_unit}
                        onChange={(e) => form.setData('pricing_unit', e.target.value)}
                        className="h-12 rounded-xl border px-4 font-normal"
                    >
                        {['per_night', 'per_day', 'per_hour', 'per_person', 'per_session', 'per_package', 'per_event', 'per_service'].map((x) => (
                            <option key={x} value={x}>
                                {x.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </label>
                {field('quantity', isRoom ? 'Number of rooms' : isCottage ? 'Number of cottages' : 'Available quantity', 'number')}
                {field(
                    'capacity',
                    isRoom
                        ? 'Maximum guests per room'
                        : isCottage
                          ? 'Maximum guests per cottage'
                          : isPool
                            ? 'Maximum pool capacity'
                            : 'Guest capacity',
                    'number',
                )}
                {field('duration_minutes', 'Duration in minutes', 'number')}
                {field('check_in_time', 'Check-in time', 'time')}
                {field('check_out_time', 'Check-out time', 'time')}
            </div>
            {isPool && form.data.pool_type === 'private' && (
                <section className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="font-extrabold text-[#0F766E]">Pool sessions</h3>
                            <p className="text-sm text-[#64748B]">Set bookable schedules, prices, and capacity.</p>
                        </div>
                        <Button type="button" variant="outline" onClick={addSession}>
                            Add session
                        </Button>
                    </div>
                    <div className="mt-4 grid gap-4">
                        {form.data.sessions.map((session, index) => (
                            <div key={index} className="grid gap-3 rounded-xl bg-white p-4 md:grid-cols-5">
                                {(['name', 'start_time', 'end_time', 'price', 'capacity'] as const).map((key) => (
                                    <label key={key} className="grid gap-1 text-xs font-bold capitalize">
                                        {key.replace('_', ' ')}
                                        <input
                                            type={key.includes('time') ? 'time' : key === 'name' ? 'text' : 'number'}
                                            value={session[key]}
                                            onChange={(e) =>
                                                form.setData(
                                                    'sessions',
                                                    form.data.sessions.map((item, itemIndex) =>
                                                        itemIndex === index ? { ...item, [key]: e.target.value } : item,
                                                    ),
                                                )
                                            }
                                            className="h-10 rounded-lg border px-3 font-normal"
                                        />
                                    </label>
                                ))}
                                <div className="flex items-center gap-3 md:col-span-5">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={session.is_active}
                                            onChange={(e) =>
                                                form.setData(
                                                    'sessions',
                                                    form.data.sessions.map((item, itemIndex) =>
                                                        itemIndex === index ? { ...item, is_active: e.target.checked } : item,
                                                    ),
                                                )
                                            }
                                        />{' '}
                                        Active
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            form.setData(
                                                'sessions',
                                                form.data.sessions.filter((_, itemIndex) => itemIndex !== index),
                                            )
                                        }
                                        className="text-sm font-bold text-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <label className="grid gap-2 text-sm font-bold">
                Short description
                <textarea
                    value={form.data.short_description}
                    onChange={(e) => form.setData('short_description', e.target.value)}
                    className="min-h-24 rounded-xl border p-4 font-normal"
                />
            </label>
            <label className="grid gap-2 text-sm font-bold">
                Full description
                <textarea
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    className="min-h-32 rounded-xl border p-4 font-normal"
                />
            </label>
            <label className="grid gap-2 text-sm font-bold">
                Amenities <span className="font-normal text-[#64748B]">Comma-separated</span>
                <input
                    value={form.data.amenities.join(', ')}
                    onChange={(e) =>
                        form.setData(
                            'amenities',
                            e.target.value
                                .split(',')
                                .map((x) => x.trim())
                                .filter(Boolean),
                        )
                    }
                    className="h-12 rounded-xl border px-4 font-normal"
                />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold">
                    Main image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => form.setData('main_image', e.target.files?.[0] ?? null)}
                        className="rounded-xl border p-3 font-normal"
                    />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                    Gallery images
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => form.setData('gallery_images', Array.from(e.target.files ?? []))}
                        className="rounded-xl border p-3 font-normal"
                    />
                </label>
            </div>
            <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm font-bold">
                    <input
                        type="checkbox"
                        checked={form.data.reservation_required}
                        onChange={(e) => form.setData('reservation_required', e.target.checked)}
                    />
                    Accept reservations
                </label>
                <label className="flex items-center gap-2 text-sm font-bold">
                    Status
                    <select
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
                        className="rounded-lg border px-3 py-2 font-normal"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </label>
            </div>
            <Button disabled={form.processing} className="bg-[#F97316] hover:bg-[#C2410C]">
                {form.processing && <LoaderCircle className="animate-spin" />} Save service
            </Button>
        </form>
    );
}
