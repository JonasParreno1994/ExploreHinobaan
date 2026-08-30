import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
const labels: Record<string, string> = {
    total: 'Total tourists',
    domestic: 'Domestic',
    foreign: 'Foreign',
    adults: 'Adults',
    children: 'Children',
    overnight: 'Overnight',
    day_visitors: 'Day visitors',
    tour_participants: 'Tour participants',
};
export default function Index({ arrivals, reports, summary, filters, enterprises, enterpriseTypes, barangays }: { [key: string]: any }) {
    const set = (key: string, value: string) =>
        router.get(route('admin.tourist-arrivals.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    const review = (id: number, status: string) => {
        const notes = status === 'returned' ? (window.prompt('Reason for returning this report') ?? '') : '';
        if (status === 'returned' && !notes) return;
        router.patch(route('admin.daily-tourist-reports.update', id), { status, admin_notes: notes });
    };
    return (
        <AdminLayout
            title="Tourist Arrival Monitoring"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Tourist Arrivals', href: '/admin/tourist-arrivals' },
            ]}
        >
            <Head title="Tourist Arrival Monitoring" />
            <div className="space-y-6">
                <div>
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Municipal tourism statistics</p>
                    <h1 className="text-3xl font-extrabold text-slate-900">Tourist Arrival Monitoring</h1>
                    <p className="text-slate-500">Consolidated actual arrivals reported by qualified tourism enterprises.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {Object.entries(summary).map(([k, v]) => (
                        <article key={k} className="rounded-2xl border bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">{labels[k] ?? k}</p>
                            <strong className="mt-2 block text-3xl text-teal-800">{String(v)}</strong>
                        </article>
                    ))}
                </div>
                <div className="grid gap-3 rounded-2xl border bg-white p-5 md:grid-cols-3 xl:grid-cols-4">
                    <input
                        type="date"
                        value={filters.date_from ?? ''}
                        onChange={(e) => set('date_from', e.target.value)}
                        className="rounded-xl border p-3"
                    />
                    <input
                        type="date"
                        value={filters.date_to ?? ''}
                        onChange={(e) => set('date_to', e.target.value)}
                        className="rounded-xl border p-3"
                    />
                    <Select value={filters.enterprise_id} onChange={(v) => set('enterprise_id', v)} label="All enterprises" items={enterprises} />
                    <Select
                        value={filters.enterprise_type_id}
                        onChange={(v) => set('enterprise_type_id', v)}
                        label="All enterprise types"
                        items={enterpriseTypes}
                    />
                    <Select value={filters.barangay_id} onChange={(v) => set('barangay_id', v)} label="All barangays" items={barangays} />
                    <select
                        value={filters.visitor_type ?? ''}
                        onChange={(e) => set('visitor_type', e.target.value)}
                        className="rounded-xl border p-3"
                    >
                        <option value="">Domestic & foreign</option>
                        <option value="domestic">Domestic</option>
                        <option value="foreign">Foreign</option>
                    </select>
                    <select
                        value={filters.booking_source ?? ''}
                        onChange={(e) => set('booking_source', e.target.value)}
                        className="rounded-xl border p-3"
                    >
                        <option value="">All booking sources</option>
                        {['website_reservation', 'walk_in', 'direct_booking', 'phone_booking', 'other'].map((x) => (
                            <option value={x}>{x.replaceAll('_', ' ')}</option>
                        ))}
                    </select>
                </div>
                <Table title="Arrival records" rows={arrivals.data} />
                <section className="rounded-2xl border bg-white p-5">
                    <h2 className="text-xl font-bold">Daily Tourist Reports</h2>
                    <div className="mt-4 space-y-3">
                        {reports.data.map((r: any) => (
                            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
                                <div>
                                    <strong>{r.enterprise.business_name}</strong>
                                    <p className="text-sm text-slate-500">
                                        {r.report_date} · <span className="capitalize">{r.status}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {r.status === 'submitted' && (
                                        <>
                                            <button
                                                onClick={() => review(r.id, 'verified')}
                                                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white"
                                            >
                                                Verify
                                            </button>
                                            <button
                                                onClick={() => review(r.id, 'returned')}
                                                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700"
                                            >
                                                Return
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
function Select({ value, onChange, label, items }: { value?: string; onChange: (v: string) => void; label: string; items: any[] }) {
    return (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="rounded-xl border p-3">
            <option value="">{label}</option>
            {items.map((i) => (
                <option key={i.id} value={i.id}>
                    {i.business_name ?? i.name}
                </option>
            ))}
        </select>
    );
}
function Table({ title, rows }: { title: string; rows: any[] }) {
    return (
        <section className="overflow-hidden rounded-2xl border bg-white">
            <h2 className="p-5 text-xl font-bold">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            {['Date', 'Enterprise', 'Type / Barangay', 'Source', 'Guests', 'Classification', 'Origin', 'Visit'].map((x) => (
                                <th className="p-4" key={x}>
                                    {x}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((a) => (
                            <tr className="border-t" key={a.id}>
                                <td className="p-4">{a.arrival_date}</td>
                                <td className="p-4 font-bold">{a.enterprise.business_name}</td>
                                <td className="p-4">
                                    {a.enterprise.enterprise_type?.name} · {a.enterprise.barangay?.name}
                                </td>
                                <td className="p-4 capitalize">{a.booking_source.replaceAll('_', ' ')}</td>
                                <td className="p-4 font-bold">{a.total_guests}</td>
                                <td className="p-4 capitalize">{a.visitor_type}</td>
                                <td className="p-4">
                                    {a.visitor_type === 'foreign' ? a.country : [a.city_municipality, a.province].filter(Boolean).join(', ')}
                                </td>
                                <td className="p-4 capitalize">{a.visit_type.replaceAll('_', ' ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
