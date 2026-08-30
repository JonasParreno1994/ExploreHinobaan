import { BackToLanding } from '@/components/back-to-landing';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, CheckCircle2, Clock3, Printer, XCircle } from 'lucide-react';

interface ReservationItem {
    quantity: number;
    number_of_guests: number;
    adults: number | null;
    children: number | null;
    check_in: string | null;
    check_out: string | null;
    reservation_date: string | null;
    start_time: string | null;
    end_time: string | null;
    service: { name: string; pricing_unit: string };
    session: { name: string; start_time: string; end_time: string } | null;
}

interface Reservation {
    reservation_number: string;
    customer_name: string;
    total_amount: string;
    reservation_fee: string | null;
    payment_status: string;
    status: string;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    enterprise: { business_name: string; slug: string; email: string | null; phone: string | null };
    items: ReservationItem[];
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-teal-100 text-teal-800',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-200 text-slate-700',
};

export default function ReservationStatus({ reservation }: { reservation: Reservation }) {
    const item = reservation.items[0];
    const statusLabel = reservation.status.replace('_', ' ');
    const schedule = item?.check_in
        ? `${formatDate(item.check_in)} – ${formatDate(item.check_out)}`
        : item?.reservation_date
          ? `${formatDate(item.reservation_date)}${item.session ? ` · ${item.session.name}` : ''}`
          : 'Not available';
    const StatusIcon = ['rejected', 'cancelled'].includes(reservation.status)
        ? XCircle
        : ['confirmed', 'completed'].includes(reservation.status)
          ? CheckCircle2
          : Clock3;

    return (
        <div className="min-h-screen bg-[#FFFBF5] px-5 py-8 text-[#1F2937] print:bg-white print:p-0">
            <Head title={`Reservation ${reservation.reservation_number}`} />
            <header className="mx-auto flex max-w-4xl justify-between gap-3 print:hidden">
                <BackToLanding />
                <button
                    onClick={() => window.print()}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-bold text-white"
                >
                    <Printer className="size-4" /> Print Acknowledgment
                </button>
            </header>

            <main className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl print:mt-0 print:border-0 print:shadow-none">
                <section className="bg-[#0F766E] p-7 text-white sm:p-10 print:bg-white print:text-[#1F2937]">
                    <p className="text-xs font-bold tracking-[0.2em] text-[#FBBF24] print:text-[#0F766E]">BOOKING ACKNOWLEDGMENT</p>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <h1 className="text-3xl font-extrabold">{reservation.enterprise.business_name}</h1>
                            <p className="mt-2">Reservation {reservation.reservation_number}</p>
                        </div>
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold capitalize ${statusStyles[reservation.status] ?? statusStyles.pending}`}
                        >
                            <StatusIcon className="size-4" /> {statusLabel}
                        </span>
                    </div>
                </section>

                <section className="grid gap-8 p-7 sm:grid-cols-2 sm:p-10">
                    <div>
                        <h2 className="text-lg font-extrabold">Reservation Details</h2>
                        <dl className="mt-5 grid gap-4">
                            <Row label="Guest" value={reservation.customer_name} />
                            <Row label="Service" value={item?.service.name ?? 'Not available'} />
                            <Row label="Schedule" value={schedule} />
                            <Row label="Quantity" value={String(item?.quantity ?? 0)} />
                            <Row label="Guests" value={String(item?.number_of_guests ?? 0)} />
                        </dl>
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold">Payment & Status</h2>
                        <dl className="mt-5 grid gap-4">
                            <Row
                                label="Service total"
                                value={`₱${Number(reservation.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                            />
                            {Number(reservation.reservation_fee ?? 0) > 0 && (
                                <Row
                                    label="Reservation fee"
                                    value={`₱${Number(reservation.reservation_fee).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                                />
                            )}
                            <Row label="Payment" value={reservation.payment_status.replaceAll('_', ' ')} />
                            <Row label="Status updated" value={formatDateTime(reservation.updated_at)} />
                        </dl>
                    </div>
                </section>

                {reservation.rejection_reason && (
                    <section className="mx-7 mb-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 sm:mx-10 sm:mb-10">
                        <strong>Reason:</strong> {reservation.rejection_reason}
                    </section>
                )}

                <section className="border-t border-slate-100 bg-[#FFF3E6] p-7 text-sm sm:px-10 print:bg-white">
                    <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 size-5 text-[#F97316]" />
                        <p>
                            This document acknowledges the booking status shown above. Contact {reservation.enterprise.business_name}
                            {reservation.enterprise.phone ? ` at ${reservation.enterprise.phone}` : ''} for questions.
                        </p>
                    </div>
                    <div className="mt-5 print:hidden">
                        <Link href={route('enterprises.show', reservation.enterprise.slug)} className="font-bold text-[#0F766E] hover:underline">
                            View enterprise profile
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 capitalize">
            <dt className="text-sm text-[#64748B]">{label}</dt>
            <dd className="text-right text-sm font-bold">{value}</dd>
        </div>
    );
}

function formatDate(value: string | null): string {
    return value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : 'Not available';
}

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
}
