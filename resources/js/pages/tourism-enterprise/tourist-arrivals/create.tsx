import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

export default function Create({ enterprises, reservation }: { enterprises: any[]; reservation: any }) {
    const item = reservation?.items?.[0];
    const form = useForm({
        enterprise_id: reservation?.enterprise_id ?? enterprises[0]?.id ?? '',
        reservation_id: reservation?.id ?? null,
        enterprise_service_id: item?.enterprise_service_id ?? '',
        arrival_date: new Date().toISOString().slice(0, 10),
        check_in_date: item?.check_in ?? '',
        check_out_date: item?.check_out ?? '',
        booking_source: reservation ? 'website_reservation' : 'walk_in',
        visitor_type: 'domestic',
        country: 'Philippines',
        province: 'Negros Occidental',
        city_municipality: '',
        adults: item?.adults ?? 1,
        children: item?.children ?? 0,
        visit_type: item?.check_in ? 'overnight' : 'day_visit',
        arrival_type: item?.check_in ? 'accommodation_checkin' : 'day_visit',
        purpose_of_visit: 'Leisure / Vacation',
        notes: '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('partner.tourist-arrivals.store'));
    };

    return (
        <PartnerLayout>
            <Head title="Record Tourist Arrival" />
            <form onSubmit={submit} className="mx-auto grid max-w-3xl gap-6 rounded-3xl border bg-white p-7">
                <div>
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Tourist arrival monitoring</p>
                    <h1 className="text-3xl font-extrabold">{reservation ? 'Check In / Record Arrival' : 'Record Walk-in Arrival'}</h1>
                </div>
                {reservation && (
                    <p className="rounded-xl bg-teal-50 p-4">
                        Reservation {reservation.reservation_number} - {reservation.customer_name}
                    </p>
                )}

                <section className="grid gap-4 rounded-2xl border border-orange-100 bg-[#FFFBF5] p-5">
                    <div>
                        <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Step 1</p>
                        <h2 className="text-xl font-extrabold">Tourist type and origin address</h2>
                        <p className="text-sm text-slate-500">Select the classification first, then enter the tourist's place of origin.</p>
                    </div>
                    <label className="grid gap-1 text-sm font-bold">
                        Tourist type
                        <select
                            value={form.data.visitor_type}
                            onChange={(event) => {
                                const type = event.target.value;
                                form.setData('visitor_type', type);
                                form.setData('country', type === 'domestic' ? 'Philippines' : '');
                                if (type === 'foreign') {
                                    form.setData('province', '');
                                    form.setData('city_municipality', '');
                                }
                            }}
                            className="rounded-xl border bg-white p-3"
                        >
                            <option value="domestic">Local / Domestic Tourist</option>
                            <option value="foreign">Foreign Tourist</option>
                        </select>
                        {form.errors.visitor_type && <span className="text-xs text-red-600">{form.errors.visitor_type}</span>}
                    </label>
                    {form.data.visitor_type === 'domestic' ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Country" value="Philippines" disabled />
                            <Field
                                label="Province"
                                value={form.data.province}
                                error={form.errors.province}
                                onChange={(value) => form.setData('province', value)}
                            />
                            <Field
                                label="City / Municipality"
                                value={form.data.city_municipality}
                                error={form.errors.city_municipality}
                                onChange={(value) => form.setData('city_municipality', value)}
                            />
                        </div>
                    ) : (
                        <Field
                            label="Country of residence / origin"
                            value={form.data.country}
                            error={form.errors.country}
                            onChange={(value) => form.setData('country', value)}
                        />
                    )}
                </section>

                <section className="grid gap-4">
                    <div>
                        <p className="text-xs font-bold tracking-widest text-teal-700 uppercase">Step 2</p>
                        <h2 className="text-xl font-extrabold">Arrival information</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm font-bold">
                            Enterprise
                            <select
                                value={form.data.enterprise_id}
                                onChange={(event) => form.setData('enterprise_id', Number(event.target.value))}
                                className="rounded-xl border p-3"
                            >
                                {enterprises.map((enterprise) => (
                                    <option key={enterprise.id} value={enterprise.id}>
                                        {enterprise.business_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <Field
                            label="Arrival date"
                            type="date"
                            value={form.data.arrival_date}
                            error={form.errors.arrival_date}
                            onChange={(value) => form.setData('arrival_date', value)}
                        />
                        <Field
                            label="Adults"
                            type="number"
                            value={String(form.data.adults)}
                            error={form.errors.adults}
                            onChange={(value) => form.setData('adults', Number(value))}
                        />
                        <Field
                            label="Children"
                            type="number"
                            value={String(form.data.children)}
                            error={form.errors.children}
                            onChange={(value) => form.setData('children', Number(value))}
                        />
                    </div>
                </section>
                <button disabled={form.processing} className="rounded-xl bg-orange-500 p-3 font-bold text-white disabled:opacity-60">
                    Save Tourist Arrival
                </button>
            </form>
        </PartnerLayout>
    );
}

function Field({
    label,
    value,
    error,
    type = 'text',
    disabled = false,
    onChange,
}: {
    label: string;
    value: string;
    error?: string;
    type?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
}) {
    return (
        <label className="grid gap-1 text-sm font-bold">
            {label}
            <input
                type={type}
                value={value}
                disabled={disabled}
                min={type === 'number' ? '0' : undefined}
                onChange={(event) => onChange?.(event.target.value)}
                className="rounded-xl border bg-white p-3 disabled:bg-slate-100 disabled:text-slate-600"
            />
            {error && <span className="text-xs text-red-600">{error}</span>}
        </label>
    );
}
