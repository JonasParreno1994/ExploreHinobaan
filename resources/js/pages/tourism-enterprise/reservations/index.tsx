import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
interface Reservation {
    id: number;
    reservation_number: string;
    customer_name: string;
    total_amount: string;
    status: string;
    created_at: string;
    enterprise: { business_name: string };
    items: { service: { name: string } }[];
}
export default function Index({ reservations }: { reservations: { data: Reservation[] } }) {
    return (
        <PartnerLayout>
            <Head title="Reservations" />
            <h1 className="text-3xl font-extrabold">Reservations</h1>
            <p className="mt-2 text-sm text-[#64748B]">Review and respond to reservation requests for your enterprises.</p>
            <div className="mt-7 overflow-x-auto rounded-3xl border bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#FFF3E6] text-xs uppercase">
                        <tr>
                            {['Reservation #', 'Customer', 'Service', 'Amount', 'Status', ''].map((x) => (
                                <th key={x} className="px-5 py-4">
                                    {x}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.data.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="px-5 py-4 font-bold">{r.reservation_number}</td>
                                <td className="px-5 py-4">{r.customer_name}</td>
                                <td className="px-5 py-4">{r.items[0]?.service.name}</td>
                                <td className="px-5 py-4">₱{Number(r.total_amount).toLocaleString('en-PH')}</td>
                                <td className="px-5 py-4 capitalize">{r.status}</td>
                                <td className="px-5 py-4">
                                    <Link href={route('partner.reservations.show', r.id)} className="text-[#0F766E]">
                                        <Eye className="size-5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reservations.data.length === 0 && <p className="p-10 text-center text-[#64748B]">No reservations yet.</p>}
            </div>
        </PartnerLayout>
    );
}
