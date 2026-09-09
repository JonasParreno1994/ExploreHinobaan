import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';

type Analytics = { totals: Record<string, number>; most_viewed: { target_type: string; target_label: string; views: number }[] };
export default function TourismAnalytics({ analytics, enterprises, filters }: { analytics: Analytics; enterprises: { id: number; business_name: string; website_events_count: number }[]; filters: { from: string; to: string } }) {
    return <AdminLayout title="Tourism Analytics" breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Tourism Analytics', href: '/admin/tourism-analytics' }]}>
        <Head title="Tourism Analytics" />
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold">Enterprise Website Analytics</h1><p className="text-muted-foreground mt-1">Aggregated engagement across approved enterprise microsites.</p></div><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); router.get(route('admin.tourism-analytics.index'), { from: data.get('from'), to: data.get('to') }); }}><input name="from" type="date" defaultValue={filters.from} className="rounded-md border px-3 py-2" /><input name="to" type="date" defaultValue={filters.to} className="rounded-md border px-3 py-2" /><button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Apply</button></form></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(analytics.totals).map(([key,value]) => <article key={key} className="rounded-xl border bg-card p-5"><p className="text-muted-foreground text-sm capitalize">{key.replaceAll('_',' ')}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}</div>
        <section className="mt-6 rounded-xl border bg-card p-6"><h2 className="font-bold">Top enterprise microsites</h2><div className="mt-4 grid gap-2">{enterprises.map((enterprise) => <div key={enterprise.id} className="flex justify-between rounded-lg bg-muted p-3 text-sm"><span>{enterprise.business_name}</span><strong>{enterprise.website_events_count} events</strong></div>)}</div></section>
    </AdminLayout>;
}
