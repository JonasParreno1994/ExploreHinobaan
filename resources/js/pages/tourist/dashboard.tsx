import { TouristLayout } from '@/components/tourist/tourist-layout';
import { Head, Link } from '@inertiajs/react';
export default function Dashboard({ summary, verification }: any) {
    return (
        <TouristLayout>
            <Head title="Tourist Dashboard" />
            <div className="rounded-3xl bg-[#0F766E] p-8 text-white">
                <p className="text-xs font-bold tracking-widest text-amber-300 uppercase">Explore Hinoba-an Tourist</p>
                <h1 className="mt-2 text-3xl font-extrabold">Your travel account</h1>
                <p className="mt-2 text-teal-50">Track reservations and your identity verification in one secure place.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {Object.entries(summary).map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-orange-100 bg-white p-5">
                        <strong className="text-3xl text-[#F97316]">{String(value)}</strong>
                        <p className="mt-1 text-slate-500 capitalize">{label} reservations</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-6">
                <h2 className="text-xl font-bold">Identity verification</h2>
                <p className="mt-2 text-slate-500">
                    Status:{' '}
                    <strong className="text-[#0F766E] capitalize">{verification?.verification_status?.replace('_', ' ') ?? 'Not submitted'}</strong>
                </p>
                <Link href="/tourist/verification" className="mt-4 inline-block rounded-xl bg-[#F97316] px-5 py-3 font-bold text-white">
                    Manage Verification
                </Link>
            </div>
        </TouristLayout>
    );
}
