import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
export default function Show({ verification: v }: any) {
    const update = (status: string) => {
        const reason = status === 'verified' ? null : window.prompt('Enter the rejection or resubmission reason:');
        if (status !== 'verified' && !reason) return;
        router.patch(`/admin/tourist-verifications/${v.id}`, { verification_status: status, rejection_reason: reason });
    };
    return (
        <AdminLayout
            title="Review Tourist Verification"
            breadcrumbs={[
                { title: 'Tourist Verifications', href: '/admin/tourist-verifications' },
                { title: v.user.name, href: `/admin/tourist-verifications/${v.id}` },
            ]}
        >
            <Head title={`Verify ${v.user.name}`} />
            <div className="rounded-2xl border bg-white p-7">
                <h1 className="text-3xl font-extrabold">{v.user.name}</h1>
                <p className="mt-1 text-slate-500">
                    {v.user.email} · {v.user.phone}
                </p>
                <p className="mt-1">{[v.user.city_municipality, v.user.province, v.user.country].filter(Boolean).join(', ')}</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-3">
                    {[
                        ['ID Front', 'front'],
                        ['ID Back', 'back'],
                        ['Selfie Holding ID', 'selfie'],
                    ].map(([label, key]) => (
                        <div key={key}>
                            <h2 className="mb-2 font-bold">{label}</h2>
                            <img
                                src={`/admin/tourist-verifications/${v.id}/documents/${key}`}
                                className="aspect-[4/3] w-full rounded-xl border object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                    <button onClick={() => update('verified')} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">
                        Approve Verification
                    </button>
                    <button onClick={() => update('resubmission_required')} className="rounded-xl bg-orange-600 px-5 py-3 font-bold text-white">
                        Request Resubmission
                    </button>
                    <button onClick={() => update('rejected')} className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white">
                        Reject
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
