import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { CheckCircle2 } from 'lucide-react';

interface Reservation {
    reservation_number: string;
    total_amount: string;
    status: string;
    enterprise: { business_name: string; slug: string };
    items: { reservation_date: string | null; check_in: string | null; service: { name: string } }[];
}

export default function Success({ reservation }: { reservation: Reservation }) {
    const { auth } = usePage<SharedData>().props;
    const item = reservation.items[0];
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBF5] px-5">
            <Head title="Reservation submitted" />
            <main className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
                <CheckCircle2 className="mx-auto size-16 text-[#0F766E]" />
                <h1 className="mt-5 text-3xl font-extrabold text-[#1F2937]">Reservation Submitted Successfully</h1>
                <p className="mt-3 text-[#64748B]">Your reservation request has been sent to {reservation.enterprise.business_name}.</p>
                <p className="mt-2 text-sm text-[#64748B]">We will email you whenever the reservation status changes.</p>
                <dl className="mt-8 grid gap-4 rounded-2xl bg-[#FFF3E6] p-5 text-left">
                    <Row label="Reservation Number" value={reservation.reservation_number} />
                    <Row label="Service" value={item?.service.name ?? 'Not available'} />
                    <Row label="Reservation Date" value={item?.reservation_date ?? item?.check_in ?? 'Not available'} />
                    <Row label="Total" value={`₱${Number(reservation.total_amount).toLocaleString('en-PH')}`} />
                    <Row label="Status" value="Pending Confirmation" />
                </dl>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    {auth.user?.role?.name === 'Tourist' ? <Link href="/tourist/reservations" className="rounded-xl bg-[#0F766E] px-5 py-3 font-bold text-white">View My Reservations</Link> : <Link href="/tourist/register" className="rounded-xl bg-[#0F766E] px-5 py-3 font-bold text-white">Create Tourist Account</Link>}
                    <Link href={route('reservations.status.create')} className="rounded-xl bg-[#0F766E] px-5 py-3 font-bold text-white">
                        Check Reservation Status
                    </Link>
                    <Link
                        href={route('enterprises.show', reservation.enterprise.slug)}
                        className="rounded-xl bg-[#F97316] px-5 py-3 font-bold text-white"
                    >
                        Back to Enterprise
                    </Link>
                    <Link href={route('home')} className="rounded-xl border border-[#0F766E] px-5 py-3 font-bold text-[#0F766E]">
                        Back to Home
                    </Link>
                </div>
            </main>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 border-b border-orange-100 pb-3 last:border-0 last:pb-0">
            <dt className="text-sm text-[#64748B]">{label}</dt>
            <dd className="text-right font-bold text-[#1F2937]">{value}</dd>
        </div>
    );
}
