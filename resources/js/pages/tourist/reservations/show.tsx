import { TouristLayout } from '@/components/tourist/tourist-layout';
import { Head, Link } from '@inertiajs/react';
export default function ReservationShow({ reservation: r }: any) {
    return (
        <TouristLayout>
            <Head title={r.reservation_number} />
            <div className="rounded-3xl border border-orange-100 bg-white p-7">
                <Link href="/tourist/reservations" className="font-bold text-[#0F766E]">
                    ← My Reservations
                </Link>
                <div className="mt-5 flex flex-wrap justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-orange-600 uppercase">Reservation details</p>
                        <h1 className="text-3xl font-extrabold">{r.reservation_number}</h1>
                        <p className="text-slate-500">{r.enterprise.business_name}</p>
                    </div>
                    <span className="h-fit rounded-full bg-teal-50 px-4 py-2 font-bold text-[#0F766E] capitalize">{r.status}</span>
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <Info label="Service" value={r.items[0]?.service?.name} />
                    <Info label="Guests" value={r.items[0]?.number_of_guests} />
                    <Info label="Quantity" value={r.items[0]?.quantity} />
                    <Info label="Total" value={`₱${Number(r.total_amount).toLocaleString()}`} />
                    <Info label="Contact" value={`${r.customer_contact} · ${r.customer_email}`} />
                    <Info label="Identity" value="Linked registered tourist" />
                </div>
            </div>
        </TouristLayout>
    );
}
function Info({ label, value }: any) {
    return (
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
            <p className="mt-1 font-semibold">{value ?? 'Not available'}</p>
        </div>
    );
}
