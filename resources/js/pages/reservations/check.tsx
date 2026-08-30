import { BackToLanding } from '@/components/back-to-landing';
import { Head, useForm } from '@inertiajs/react';
import { Search, ShieldCheck } from 'lucide-react';
import { FormEvent } from 'react';

export default function CheckReservation() {
    const form = useForm({ reservation_number: '', customer_email: '' });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('reservations.status.store'));
    };

    return (
        <div className="min-h-screen bg-[#FFFBF5] px-5 py-8 text-[#1F2937]">
            <Head title="Check Reservation Status" />
            <header className="mx-auto flex max-w-5xl justify-end">
                <BackToLanding />
            </header>
            <main className="mx-auto mt-10 w-full max-w-xl rounded-3xl border border-orange-100 bg-white p-7 shadow-xl sm:p-10">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
                    <ShieldCheck className="size-7" />
                </div>
                <h1 className="mt-5 text-center text-3xl font-extrabold">Check Reservation Status</h1>
                <p className="mt-2 text-center text-sm text-[#64748B]">Enter the reservation number and email address used when booking.</p>

                <form onSubmit={submit} className="mt-8 grid gap-5">
                    <label className="text-sm font-bold">
                        Reservation number
                        <input
                            value={form.data.reservation_number}
                            onChange={(event) => form.setData('reservation_number', event.target.value.toUpperCase())}
                            placeholder="HIN-2026-XXXXXXXX"
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                        />
                        {form.errors.reservation_number && (
                            <span className="mt-1 block text-xs font-medium text-red-600">{form.errors.reservation_number}</span>
                        )}
                    </label>
                    <label className="text-sm font-bold">
                        Email address
                        <input
                            type="email"
                            value={form.data.customer_email}
                            onChange={(event) => form.setData('customer_email', event.target.value)}
                            placeholder="tourist@example.com"
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                        />
                        {form.errors.customer_email && (
                            <span className="mt-1 block text-xs font-medium text-red-600">{form.errors.customer_email}</span>
                        )}
                    </label>
                    <button
                        disabled={form.processing}
                        className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 font-bold text-white transition hover:bg-[#C2410C] disabled:opacity-60"
                    >
                        <Search className="size-5" /> {form.processing ? 'Checking...' : 'Check Reservation'}
                    </button>
                </form>
                <p className="mt-6 rounded-xl bg-[#FFF3E6] p-4 text-xs leading-5 text-[#64748B]">
                    For your privacy, both details must match the information submitted with the reservation.
                </p>
            </main>
        </div>
    );
}
