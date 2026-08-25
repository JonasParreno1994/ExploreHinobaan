import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

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
    check_in_time: string;
    check_out_time: string;
    duration_minutes: string;
    status: string;
    main_image?: File | null;
    gallery_images?: File[];
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
        check_in_time: service?.check_in_time?.slice(0, 5) ?? '',
        check_out_time: service?.check_out_time?.slice(0, 5) ?? '',
        duration_minutes: String(service?.duration_minutes ?? ''),
        status: service?.status ?? 'draft',
        main_image: null,
        gallery_images: [],
    });
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
                        onChange={(e) => form.setData('service_type_id', e.target.value)}
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
                {field('quantity', 'Available quantity', 'number')}
                {field('capacity', 'Guest capacity', 'number')}
                {field('duration_minutes', 'Duration in minutes', 'number')}
                {field('check_in_time', 'Check-in time', 'time')}
                {field('check_out_time', 'Check-out time', 'time')}
            </div>
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
