import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, router } from '@inertiajs/react';

type Analytics = { totals: Record<string, number>; most_viewed: { target_type: string; target_label: string; views: number }[] };
const labels: Record<string, string> = {
    profile_view: 'Total profile views', unique_visitors: 'Unique visitors', reservation_click: 'Reservation clicks',
    booking_conversion: 'Booking conversions', direction_click: 'Direction clicks', contact_click: 'Contact clicks',
    social_click: 'Social media clicks', content_view: 'Product/service views',
};

export default function AnalyticsPage({ enterprise, analytics, filters }: { enterprise: WebsiteEnterprise; website: EnterpriseWebsite; analytics: Analytics; filters: { range: string; from: string; to: string } }) {
    const visit = (range: string) => router.get(route('partner.websites.analytics', enterprise.id), { range }, { preserveState: true });
    return <WebsiteShell enterprise={enterprise}>
        <Head title="Website Analytics" />
        <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Website performance</p>
        <h1 className="mt-2 text-3xl font-extrabold">Analytics</h1>
        <div className="mt-5 flex flex-wrap gap-2">{[['today','Today'],['7days','Last 7 Days'],['30days','Last 30 Days'],['month','This Month']].map(([value,label]) => <button key={value} onClick={() => visit(value)} className={`rounded-xl border px-3 py-2 text-sm font-bold ${filters.range === value ? 'bg-teal-700 text-white' : 'bg-white'}`}>{label}</button>)}</div>
        <form className="mt-3 flex flex-wrap items-end gap-2" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); router.get(route('partner.websites.analytics', enterprise.id), { range: 'custom', from: data.get('from'), to: data.get('to') }, { preserveState: true }); }}>
            <label className="grid gap-1 text-xs font-bold">From<input name="from" type="date" defaultValue={filters.from} className="rounded-xl border bg-white px-3 py-2 text-sm" /></label>
            <label className="grid gap-1 text-xs font-bold">To<input name="to" type="date" defaultValue={filters.to} className="rounded-xl border bg-white px-3 py-2 text-sm" /></label>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Custom Range</button>
        </form>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Object.entries(analytics.totals).map(([key,value]) => <article key={key} className="rounded-2xl border border-orange-100 bg-white p-5"><p className="text-sm text-slate-500">{labels[key] ?? key}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}</div>
        <section className="mt-6 rounded-2xl border border-orange-100 bg-white p-6"><h2 className="text-lg font-extrabold">Most viewed content</h2><div className="mt-4 grid gap-2">{analytics.most_viewed.length ? analytics.most_viewed.map((item,index) => <div key={`${item.target_type}-${item.target_label}`} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{index + 1}. {item.target_label}</span><strong>{item.views} views</strong></div>) : <p className="text-sm text-slate-500">No content views in this period.</p>}</div></section>
    </WebsiteShell>;
}
