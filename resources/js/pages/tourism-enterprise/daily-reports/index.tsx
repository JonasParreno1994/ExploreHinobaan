import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
export default function Index({ date, summary, reports, enterprises }: { date: string; summary: any; reports: any; enterprises: any[] }) {
    const f = useForm({ enterprise_id: enterprises[0]?.id ?? '', report_date: date });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        f.post(route('partner.daily-reports.store'));
    };
    return (
        <PartnerLayout>
            <Head title="Daily Tourist Reports" />
            <div className="space-y-6">
                <h1 className="text-3xl font-extrabold">Daily Tourist Reports</h1>
                <div className="grid gap-4 sm:grid-cols-5">
                    {Object.entries(summary).map(([k, v]) => (
                        <div className="rounded-2xl border bg-white p-5" key={k}>
                            <p className="text-slate-500 capitalize">{k}</p>
                            <strong className="text-2xl">{String(v)}</strong>
                        </div>
                    ))}
                </div>
                <form onSubmit={submit} className="flex flex-wrap gap-3 rounded-2xl border bg-white p-5">
                    <input
                        type="date"
                        value={f.data.report_date}
                        onChange={(e) => f.setData('report_date', e.target.value)}
                        className="rounded-xl border p-3"
                    />
                    <select
                        value={f.data.enterprise_id}
                        onChange={(e) => f.setData('enterprise_id', Number(e.target.value))}
                        className="rounded-xl border p-3"
                    >
                        {enterprises.map((e) => (
                            <option value={e.id}>{e.business_name}</option>
                        ))}
                    </select>
                    <button className="rounded-xl bg-teal-700 px-5 font-bold text-white">
                        {Number(summary.total) === 0 ? 'Submit Zero Arrival Report' : 'Submit Daily Report'}
                    </button>
                </form>
                <div className="rounded-2xl border bg-white p-5">
                    {reports.data.map((r: any) => (
                        <div className="flex justify-between border-b py-3" key={r.id}>
                            <span>
                                {r.report_date} · {r.enterprise.business_name}
                            </span>
                            <strong className="text-teal-700 capitalize">{r.status}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </PartnerLayout>
    );
}
