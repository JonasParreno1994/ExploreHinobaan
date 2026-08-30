import { BackToLanding } from '@/components/back-to-landing';
import { Head, Link, router } from '@inertiajs/react';
import { Search, ShoppingBag } from 'lucide-react';
import { FormEvent, useState } from 'react';
export default function Index({ products, categories, filters }: any) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('local-products.index'), { search, category }, { preserveState: true });
    };
    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title="Local Products" />
            <header className="border-b bg-white px-5 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-3 font-extrabold">
                        <ShoppingBag className="text-[#F97316]" /> Hinoba-an Local Products
                    </div>
                    <BackToLanding compact />
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-5 py-12">
                <div className="text-center">
                    <p className="font-bold text-[#F97316]">SUPPORT LOCAL PRODUCERS</p>
                    <h1 className="mt-2 text-4xl font-extrabold">Shop Hinoba-an Products</h1>
                </div>
                <form onSubmit={submit} className="mx-auto mt-8 grid max-w-3xl gap-3 rounded-2xl bg-white p-4 shadow md:grid-cols-[1fr_220px_auto]">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="h-11 rounded-xl border px-3"
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-xl border px-3">
                        <option value="">All categories</option>
                        {categories.map((c: any) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 font-bold text-white">
                        <Search className="size-4" />
                        Search
                    </button>
                </form>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.data.map((p: any) => (
                        <Link
                            key={p.id}
                            href={route('local-products.show', p.slug)}
                            className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <img
                                src={p.main_image_url ?? '/images/tourism-placeholder.svg'}
                                className="h-52 w-full object-cover transition group-hover:scale-105"
                            />
                            <div className="p-5">
                                <span className="text-xs font-bold text-[#0F766E]">{p.category.name}</span>
                                <h2 className="mt-1 text-xl font-extrabold">{p.name}</h2>
                                <p className="mt-1 text-sm text-[#64748B]">
                                    {p.enterprise.business_name} · {p.enterprise.barangay?.name}
                                </p>
                                <p className="mt-4 text-xl font-extrabold text-[#F97316]">
                                    ₱{Number(p.price).toLocaleString()} <small className="text-xs text-[#64748B]">/ {p.selling_unit}</small>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                {products.data.length === 0 && (
                    <p className="mt-10 rounded-2xl border border-dashed p-10 text-center">No published products found.</p>
                )}
            </main>
        </div>
    );
}
