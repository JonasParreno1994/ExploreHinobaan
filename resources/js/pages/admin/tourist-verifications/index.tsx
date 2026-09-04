import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
export default function Index({ verifications, filters }: any) {
    return (
        <AdminLayout
            title="Tourist Verifications"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Tourist Verifications', href: '/admin/tourist-verifications' },
            ]}
        >
            <Head title="Tourist Verifications" />
            <h1 className="text-3xl font-extrabold">Tourist Verification Requests</h1>
            <div className="mt-5 flex gap-2">
                {['', 'pending', 'verified', 'rejected', 'resubmission_required'].map((s) => (
                    <button
                        key={s || 'all'}
                        onClick={() => router.get('/admin/tourist-verifications', s ? { status: s } : {})}
                        className={`rounded-xl px-4 py-2 text-sm font-bold ${filters.status === s ? 'bg-emerald-700 text-white' : 'border bg-white'}`}
                    >
                        {s ? s.replaceAll('_', ' ') : 'All'}
                    </button>
                ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b bg-slate-50">
                            <th className="p-4">Tourist</th>
                            <th>ID Type</th>
                            <th>Submitted</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {verifications.data.map((v: any) => (
                            <tr key={v.id} className="border-b">
                                <td className="p-4">
                                    <strong>{v.user.name}</strong>
                                    <small className="block text-slate-500">{v.user.email}</small>
                                </td>
                                <td>{v.id_type}</td>
                                <td>{v.submitted_at ? new Date(v.submitted_at).toLocaleDateString() : '—'}</td>
                                <td className="capitalize">{v.verification_status.replaceAll('_', ' ')}</td>
                                <td>
                                    <Link href={`/admin/tourist-verifications/${v.id}`} className="font-bold text-emerald-700">
                                        Review
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
