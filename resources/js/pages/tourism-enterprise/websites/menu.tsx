import InputError from '@/components/input-error';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface MenuItem {
    id: number;
    name: string;
    description: string | null;
    price: string;
    image_url: string | null;
    is_available: boolean;
    is_featured: boolean;
    is_best_seller: boolean;
    is_new: boolean;
}

interface MenuCategory { id: number; name: string; description: string | null; items: MenuItem[] }

export default function Menu({ enterprise, categories }: { enterprise: WebsiteEnterprise; website: EnterpriseWebsite; categories: MenuCategory[] }) {
    const categoryForm = useForm({ name: '', description: '', sort_order: 0, is_active: true });
    const itemForm = useForm({
        enterprise_menu_category_id: categories[0]?.id ?? 0,
        name: '', description: '', price: '', image: null as File | null,
        is_available: true, is_featured: false, is_best_seller: false, is_new: false, sort_order: 0,
    });
    const addCategory = (event: FormEvent) => {
        event.preventDefault();
        categoryForm.post(route('partner.websites.menu.categories.store', enterprise.id), { onSuccess: () => categoryForm.reset('name', 'description') });
    };
    const addItem = (event: FormEvent) => {
        event.preventDefault();
        itemForm.post(route('partner.websites.menu.items.store', enterprise.id), { forceFormData: true, onSuccess: () => itemForm.reset('name', 'description', 'price', 'image') });
    };

    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title={`${enterprise.business_name} Menu`} />
            <div>
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Food & beverage</p>
                <h1 className="mt-2 text-3xl font-extrabold">Menu</h1>
                <p className="mt-2 text-sm text-slate-600">Manage categories, prices, availability, featured items, best sellers, and new offerings.</p>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
                <form onSubmit={addCategory} className="grid content-start gap-4 rounded-3xl border border-orange-100 bg-white p-6">
                    <h2 className="text-lg font-extrabold">Add menu category</h2>
                    <Field label="Category name" error={categoryForm.errors.name}>
                        <input value={categoryForm.data.name} onChange={(e) => categoryForm.setData('name', e.target.value)} className="h-11 rounded-xl border px-3" />
                    </Field>
                    <Field label="Description" error={categoryForm.errors.description}>
                        <textarea value={categoryForm.data.description} onChange={(e) => categoryForm.setData('description', e.target.value)} className="rounded-xl border p-3" rows={3} />
                    </Field>
                    <button disabled={categoryForm.processing} className="w-fit rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">Add category</button>
                </form>

                <form onSubmit={addItem} className="grid gap-4 rounded-3xl border border-orange-100 bg-white p-6">
                    <h2 className="text-lg font-extrabold">Add menu item</h2>
                    <Field label="Category" error={itemForm.errors.enterprise_menu_category_id}>
                        <select value={itemForm.data.enterprise_menu_category_id} onChange={(e) => itemForm.setData('enterprise_menu_category_id', Number(e.target.value))} className="h-11 rounded-xl border px-3">
                            <option value={0}>Select category</option>
                            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Item name" error={itemForm.errors.name}><input value={itemForm.data.name} onChange={(e) => itemForm.setData('name', e.target.value)} className="h-11 rounded-xl border px-3" /></Field>
                        <Field label="Price" error={itemForm.errors.price}><input type="number" min="0" step="0.01" value={itemForm.data.price} onChange={(e) => itemForm.setData('price', e.target.value)} className="h-11 rounded-xl border px-3" /></Field>
                    </div>
                    <Field label="Description" error={itemForm.errors.description}><textarea value={itemForm.data.description} onChange={(e) => itemForm.setData('description', e.target.value)} className="rounded-xl border p-3" rows={3} /></Field>
                    <Field label="Image (at least 300 × 300)" error={itemForm.errors.image}><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => itemForm.setData('image', e.target.files?.[0] ?? null)} className="rounded-xl border p-2" /></Field>
                    <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
                        {([['is_available', 'Available'], ['is_featured', 'Featured'], ['is_best_seller', 'Best Seller'], ['is_new', 'New Item']] as const).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={itemForm.data[key]} onChange={(e) => itemForm.setData(key, e.target.checked)} /> {label}</label>
                        ))}
                    </div>
                    <button disabled={itemForm.processing || categories.length === 0} className="w-fit rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white">Add menu item</button>
                </form>
            </div>

            <div className="mt-6 grid gap-5">
                {categories.map((category) => (
                    <section key={category.id} className="rounded-3xl border border-orange-100 bg-white p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div><h2 className="text-xl font-extrabold">{category.name}</h2><p className="text-sm text-slate-500">{category.description}</p></div>
                            <button type="button" onClick={() => router.delete(route('partner.websites.menu.categories.destroy', [enterprise.id, category.id]))} className="text-xs font-bold text-red-600">Delete category</button>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {category.items.map((item) => (
                                <article key={item.id} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                                    {item.image_url && <img src={item.image_url} alt="" className="size-20 rounded-xl object-cover" />}
                                    <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><strong>{item.name}</strong><span className="font-bold text-teal-700">₱{Number(item.price).toLocaleString('en-PH')}</span></div><p className="line-clamp-2 text-xs text-slate-500">{item.description}</p><div className="mt-2 flex flex-wrap gap-1 text-[10px] font-bold text-orange-700">{item.is_featured && <span>FEATURED</span>}{item.is_best_seller && <span>BEST SELLER</span>}{item.is_new && <span>NEW</span>}</div><button type="button" onClick={() => router.delete(route('partner.websites.menu.items.destroy', [enterprise.id, item.id]))} className="mt-2 text-xs font-bold text-red-600">Remove</button></div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </WebsiteShell>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return <label className="grid gap-2 text-sm font-bold">{label}{children}<InputError message={error} /></label>;
}
