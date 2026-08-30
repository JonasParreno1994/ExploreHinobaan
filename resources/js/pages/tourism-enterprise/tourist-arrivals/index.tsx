import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, Link } from '@inertiajs/react';
export default function Index({ arrivals, statistics }: { arrivals: any; statistics: any }) {
    return (
        <PartnerLayout>
            <Head title="Tourist Arrivals" />
            <div className="space-y-6">
                <div className="flex justify-between">
                    <div>
                        <p className="text-xs font-bold text-orange-600 uppercase">Actual visitors</p>
                        <h1 className="text-3xl font-extrabold">Tourist Arrivals</h1>
                    </div>
                    <Link href={route('partner.tourist-arrivals.create')} className="h-fit rounded-xl bg-orange-500 px-5 py-3 font-bold text-white">
                        + Record Arrival
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-5">
                    {Object.entries(statistics).map(([k, v]) => (
                        <div className="rounded-2xl border bg-white p-5" key={k}>
                            <p className="text-sm text-slate-500 capitalize">{k}</p>
                            <strong className="text-2xl">{String(v)}</strong>
                        </div>
                    ))}
                </div>
                <div className="overflow-x-auto rounded-2xl border bg-white">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr>
                                {['Date', 'Enterprise', 'Source', 'Guests', 'Visitor', 'Origin', 'Visit'].map((x) => (
                                    <th className="p-4" key={x}>
                                        {x}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {arrivals.data.map((a: any) => (
                                <tr className="border-t" key={a.id}>
                                    <td className="p-4">{a.arrival_date}</td>
                                    <td className="p-4">{a.enterprise.business_name}</td>
                                    <td className="p-4 capitalize">{a.booking_source.replaceAll('_', ' ')}</td>
                                    <td className="p-4">{a.total_guests}</td>
                                    <td className="p-4 capitalize">{a.visitor_type}</td>
                                    <td className="p-4">
                                        {a.visitor_type === 'foreign' ? a.country : [a.city_municipality, a.province].filter(Boolean).join(', ')}
                                    </td>
                                    <td className="p-4 capitalize">{a.visit_type.replaceAll('_', ' ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PartnerLayout>
    );
}
