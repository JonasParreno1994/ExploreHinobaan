import { TouristLayout } from '@/components/tourist/tourist-layout';
import { Head } from '@inertiajs/react';
export default function Profile({ tourist }: any) {
    return (
        <TouristLayout>
            <Head title="Tourist Profile" />
            <div className="rounded-3xl border border-orange-100 bg-white p-7">
                <h1 className="text-3xl font-extrabold">My Profile</h1>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {Object.entries(tourist).map(([key, value]) => (
                        <div key={key}>
                            <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">{key.replaceAll('_', ' ')}</p>
                            <p className="mt-1 font-semibold">{value ? String(value) : 'Not provided'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </TouristLayout>
    );
}
