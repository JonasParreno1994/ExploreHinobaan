import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
export default function Index({ products }: any) {
    return (
        <PartnerLayout>
            <Head title="Local Products" />
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-[#F97316]">SELLER CATALOG</p>
                    <h1 className="text-3xl font-extrabold">Local Products</h1>
                </div>
                <Link href={route('partner.products.create')} className="flex gap-2 rounded-xl bg-[#F97316] px-4 py-3 font-bold text-white">
                    <Plus /> Add Product
                </Link>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
                {products.data.map((p: any) => (
                    <article key={p.id} className="flex gap-4 rounded-2xl border bg-white p-4">
                        <img src={p.main_image_url ?? '/images/tourism-placeholder.svg'} className="size-24 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-[#0F766E] uppercase">{p.status.replace('_', ' ')}</span>
                            <h2 className="text-xl font-bold">{p.name}</h2>
                            <p>
                                ₱{Number(p.price).toLocaleString()} / {p.selling_unit} · {p.stock_quantity} in stock
                            </p>
                            <div className="mt-3 flex gap-3">
                                <Link href={route('partner.products.edit', p.id)} className="font-bold text-[#F97316]">
                                    Edit
                                </Link>
                                <button onClick={() => router.delete(route('partner.products.destroy', p.id))} className="font-bold text-red-600">
                                    Archive
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </PartnerLayout>
    );
}
