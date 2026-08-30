import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Option = { id: number; name: string };
type Product = {
    id: number;
    enterprise_id: number;
    product_category_id: number;
    name: string;
    sku: string | null;
    short_description: string | null;
    description: string;
    price: string;
    selling_unit: string;
    stock_quantity: number;
    low_stock_threshold: number | null;
    is_made_to_order: boolean;
    preparation_days: number | null;
};

export default function ProductForm({ enterprises, categories, product }: { enterprises: Option[]; categories: Option[]; product?: Product }) {
    const form = useForm({
        enterprise_id: product?.enterprise_id ?? enterprises[0]?.id ?? '',
        product_category_id: product?.product_category_id ?? categories[0]?.id ?? '',
        name: product?.name ?? '',
        sku: product?.sku ?? '',
        short_description: product?.short_description ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        selling_unit: product?.selling_unit ?? 'piece',
        stock_quantity: product?.stock_quantity ?? 0,
        low_stock_threshold: product?.low_stock_threshold ?? '',
        is_made_to_order: product?.is_made_to_order ?? false,
        preparation_days: product?.preparation_days ?? '',
        main_image: null as File | null,
        gallery_images: [] as File[],
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (product) {
            form.post(route('partner.products.update', product.id), { forceFormData: true, headers: { 'X-HTTP-Method-Override': 'PUT' } });
        } else {
            form.post(route('partner.products.store'), { forceFormData: true });
        }
    };
    const field = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3';
    return (
        <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm md:grid-cols-2">
            <Select
                label="Enterprise"
                value={form.data.enterprise_id}
                options={enterprises}
                onChange={(value) => form.setData('enterprise_id', Number(value))}
                error={form.errors.enterprise_id}
            />
            <Select
                label="Category"
                value={form.data.product_category_id}
                options={categories}
                onChange={(value) => form.setData('product_category_id', Number(value))}
                error={form.errors.product_category_id}
            />
            <Field label="Product name" value={form.data.name} onChange={(value) => form.setData('name', value)} error={form.errors.name} />
            <Field label="SKU (optional)" value={form.data.sku} onChange={(value) => form.setData('sku', value)} error={form.errors.sku} />
            <Field label="Price" type="number" value={form.data.price} onChange={(value) => form.setData('price', value)} error={form.errors.price} />
            <label className="text-sm font-bold">
                Selling unit
                <select className={`mt-1 ${field}`} value={form.data.selling_unit} onChange={(e) => form.setData('selling_unit', e.target.value)}>
                    {['piece', 'pack', 'box', 'bottle', 'jar', 'kilogram', 'bundle', 'set'].map((unit) => (
                        <option key={unit}>{unit}</option>
                    ))}
                </select>
            </label>
            <Field
                label="Stock quantity"
                type="number"
                value={String(form.data.stock_quantity)}
                onChange={(value) => form.setData('stock_quantity', Number(value))}
                error={form.errors.stock_quantity}
            />
            <Field
                label="Low-stock warning"
                type="number"
                value={String(form.data.low_stock_threshold)}
                onChange={(value) => form.setData('low_stock_threshold', value)}
                error={form.errors.low_stock_threshold}
            />
            <label className="text-sm font-bold md:col-span-2">
                Short description
                <textarea
                    className="mt-1 min-h-20 w-full rounded-xl border p-3 font-normal"
                    value={form.data.short_description}
                    onChange={(e) => form.setData('short_description', e.target.value)}
                />
            </label>
            <label className="text-sm font-bold md:col-span-2">
                Full description
                <textarea
                    className="mt-1 min-h-32 w-full rounded-xl border p-3 font-normal"
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                />
                {form.errors.description && <small className="text-red-600">{form.errors.description}</small>}
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" checked={form.data.is_made_to_order} onChange={(e) => form.setData('is_made_to_order', e.target.checked)} />{' '}
                Made to order
            </label>
            <Field
                label="Preparation days"
                type="number"
                value={String(form.data.preparation_days)}
                onChange={(value) => form.setData('preparation_days', value)}
                error={form.errors.preparation_days}
            />
            <label className="text-sm font-bold">
                Main image
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="mt-2 block text-xs"
                    onChange={(e) => form.setData('main_image', e.target.files?.[0] ?? null)}
                />
                {form.errors.main_image && <small className="text-red-600">{form.errors.main_image}</small>}
            </label>
            <label className="text-sm font-bold">
                Gallery images
                <input
                    multiple
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="mt-2 block text-xs"
                    onChange={(e) => form.setData('gallery_images', Array.from(e.target.files ?? []))}
                />
            </label>
            <button disabled={form.processing} className="rounded-xl bg-[#F97316] px-5 py-3 font-bold text-white md:col-span-2">
                {form.processing ? 'Saving...' : product ? 'Save and resubmit' : 'Submit product for review'}
            </button>
        </form>
    );
}

function Field({
    label,
    value,
    onChange,
    error,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
}) {
    return (
        <label className="text-sm font-bold">
            {label}
            <input
                type={type}
                step={type === 'number' ? '0.01' : undefined}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border px-3 font-normal"
            />
            {error && <small className="text-red-600">{error}</small>}
        </label>
    );
}
function Select({
    label,
    value,
    options,
    onChange,
    error,
}: {
    label: string;
    value: string | number;
    options: Option[];
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <label className="text-sm font-bold">
            {label}
            <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-11 w-full rounded-xl border px-3">
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            {error && <small className="text-red-600">{error}</small>}
        </label>
    );
}
