import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
interface Reservation {
    id: number;
    reservation_number: string;
    customer_name: string;
    customer_email: string;
    customer_contact: string;
    total_amount: string;
    status: string;
    special_request: string | null;
    rejection_reason: string | null;
    created_at: string;
    enterprise: { business_name: string };
    items: {
        id: number;
        quantity: number;
        number_of_guests: number;
        check_in: string | null;
        check_out: string | null;
        reservation_date: string | null;
        start_time: string | null;
        end_time: string | null;
        purpose: string | null;
        unit_price: string;
        subtotal: string;
        service: { name: string; pricing_unit: string };
    }[];
}
export default function Show({ reservation: r }: { reservation: Reservation }) {
    const update = (status: string) => {
        const reason = status === 'rejected' ? (window.prompt('Reason for rejection') ?? '') : null;
        if (status === 'rejected' && !reason) return;
        router.patch(route('partner.reservations.status', r.id), { status, rejection_reason: reason });
    };
    return (
        <PartnerLayout>
            <Head title={r.reservation_number} />
            <div className="rounded-3xl border bg-white p-7 shadow-sm">
                <div className="flex flex-wrap justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-[#F97316] uppercase">Reservation details</p>
                        <h1 className="mt-2 text-3xl font-extrabold">{r.reservation_number}</h1>
                        <p className="mt-1 text-[#64748B]">{r.enterprise.business_name}</p>
                    </div>
                    <span className="h-fit rounded-full bg-teal-50 px-4 py-2 font-bold text-[#0F766E] capitalize">{r.status}</span>
                </div>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <Info label="Customer" value={r.customer_name} />
                    <Info label="Contact" value={`${r.customer_contact} · ${r.customer_email}`} />
                    <Info label="Service" value={r.items[0]?.service.name} />
                    <Info
                        label="Schedule"
                        value={
                            r.items[0]?.check_in
                                ? `${r.items[0].check_in} – ${r.items[0].check_out}`
                                : `${r.items[0]?.reservation_date ?? ''} ${r.items[0]?.start_time ?? ''}`
                        }
                    />
                    <Info label="Guests / Quantity" value={`${r.items[0]?.number_of_guests} guests · ${r.items[0]?.quantity} unit(s)`} />
                    <Info label="Total" value={`₱${Number(r.total_amount).toLocaleString('en-PH')}`} />
                </div>
                {r.special_request && (
                    <div className="mt-6 rounded-2xl bg-[#FFF3E6] p-4">
                        <strong>Special request</strong>
                        <p className="mt-1 text-sm">{r.special_request}</p>
                    </div>
                )}
                <div className="mt-7 flex gap-3 border-t pt-5">
                    {r.status === 'pending' && (
                        <>
                            <Button onClick={() => update('confirmed')} className="bg-[#0F766E]">
                                Confirm Reservation
                            </Button>
                            <Button variant="destructive" onClick={() => update('rejected')}>
                                Reject Reservation
                            </Button>
                        </>
                    )}
                    {r.status === 'confirmed' && (
                        <>
                            <Button onClick={() => update('completed')} className="bg-[#0F766E]">
                                Mark Completed
                            </Button>
                            <Button variant="outline" onClick={() => update('cancelled')}>
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </PartnerLayout>
    );
}
function Info({ label, value }: { label: string; value: string | undefined }) {
    return (
        <div>
            <dt className="text-xs font-bold text-[#64748B] uppercase">{label}</dt>
            <dd className="mt-1 font-semibold">{value || 'Not available'}</dd>
        </div>
    );
}
