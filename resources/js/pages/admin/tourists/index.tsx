import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, ShieldCheck, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Tourist = { id: number; name: string; email: string; phone?: string; status: string; email_verified_at?: string; reservations_count: number; tourist_verification?: { verification_status: string } };
type Props = { filters: { search: string; status: string; emailVerification: string; identityStatus: string }; summary: Record<string, number>; tourists: { data: Tourist[]; total: number; from: number | null; to: number | null; links: { url: string | null; label: string; active: boolean }[] } };
const readable = (value?: string) => (value || 'not_submitted').replaceAll('_', ' ');

export default function TouristIndex({ filters, summary, tourists }: Props) {
    const [search, setSearch] = useState(filters.search);
    const visit = (changes: Record<string, string>) => router.get('/admin/tourists', {
        search,
        status: changes.status ?? filters.status,
        email_verification: changes.emailVerification ?? filters.emailVerification,
        identity_status: changes.identityStatus ?? filters.identityStatus,
    }, { preserveState: true, replace: true });
    const submit = (event: FormEvent) => { event.preventDefault(); visit({}); };
    const metrics = [['Registered tourists', summary.total], ['Active accounts', summary.active], ['Identity verified', summary.identity_verified], ['Pending review', summary.verification_pending], ['Suspended', summary.suspended]];

    return <AdminLayout title="Tourist Accounts" breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Tourists', href: '/admin/tourists' }]}>
        <Head title="Tourist Accounts" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-orange-600">Tourist management</p><h1 className="text-3xl font-extrabold text-slate-900">Tourist Accounts</h1><p className="mt-1 text-slate-500">Registered tourists, verification status, and reservation activity.</p></div><Link href="/admin/tourist-verifications" className="inline-flex items-center gap-2 rounded-xl border border-teal-700 px-4 py-2.5 text-sm font-bold text-teal-700"><ShieldCheck className="size-4" /> Review verifications</Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{metrics.map(([title, value]) => <div key={title} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"><Users className="mb-3 size-5 text-orange-600" /><div className="text-2xl font-extrabold">{value}</div><div className="text-sm text-slate-500">{title}</div></div>)}</div>
        <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl border bg-white p-4 lg:grid-cols-[1fr_repeat(3,180px)_auto]">
            <label className="relative"><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, email, or phone" className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm" /></label>
            <select value={filters.status} onChange={event => visit({ status: event.target.value })} className="h-10 rounded-lg border px-3 text-sm"><option value="">All accounts</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="inactive">Inactive</option></select>
            <select value={filters.emailVerification} onChange={event => visit({ emailVerification: event.target.value })} className="h-10 rounded-lg border px-3 text-sm"><option value="">All email statuses</option><option value="verified">Email verified</option><option value="unverified">Email unverified</option></select>
            <select value={filters.identityStatus} onChange={event => visit({ identityStatus: event.target.value })} className="h-10 rounded-lg border px-3 text-sm"><option value="">All identity statuses</option><option value="not_submitted">Not submitted</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option><option value="resubmission_required">Resubmission required</option></select>
            <button className="h-10 rounded-lg bg-orange-600 px-5 font-bold text-white">Search</button>
        </form>
        <div className="mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Tourist</th><th>Contact</th><th>Email</th><th>Identity</th><th>Reservations</th><th>Account</th><th className="pr-4 text-right">Action</th></tr></thead><tbody>{tourists.data.map(tourist => <tr key={tourist.id} className="border-b last:border-0"><td className="p-4 font-bold">{tourist.name}</td><td>{tourist.phone || 'Not provided'}</td><td>{tourist.email}<small className={`block ${tourist.email_verified_at ? 'text-emerald-700' : 'text-amber-700'}`}>{tourist.email_verified_at ? 'Verified' : 'Unverified'}</small></td><td className="capitalize">{readable(tourist.tourist_verification?.verification_status)}</td><td>{tourist.reservations_count}</td><td><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${tourist.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{tourist.status}</span></td><td className="pr-4 text-right"><Link href={`/admin/tourists/${tourist.id}`} className="font-bold text-teal-700">View account</Link></td></tr>)}</tbody></table></div>{tourists.data.length === 0 && <p className="p-10 text-center text-slate-500">No tourist accounts match these filters.</p>}<div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-slate-500"><span>{tourists.total ? `Showing ${tourists.from}-${tourists.to} of ${tourists.total}` : 'No records'}</span><div className="flex gap-1">{tourists.links.map((link, index) => link.url ? <Link key={index} href={link.url} preserveScroll className={`rounded-lg px-3 py-1.5 ${link.active ? 'bg-teal-700 text-white' : 'border'}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : null)}</div></div></div>
    </AdminLayout>;
}
