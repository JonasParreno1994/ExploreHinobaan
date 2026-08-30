import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { Check, Star, X } from 'lucide-react';
export default function Index({ products }: any) {
    return (
        <AdminLayout
            title="Local Products"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Local Products', href: '/admin/local-products' },
            ]}
        >
            <Head title="Local Products" />
            <div className="rounded-xl border bg-white">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Local Product Review</h1>
                    <p className="text-sm text-slate-500">Approve producer listings before they appear publicly.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left">
                            <tr>
                                <th className="p-4">Product</th>
                                <th>Producer</th>
                                <th>Category</th>
                                <th>Price / Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((p: any) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={p.main_image_url ?? '/images/tourism-placeholder.svg'}
                                                className="size-14 rounded-lg object-cover"
                                            />
                                            <b>{p.name}</b>
                                        </div>
                                    </td>
                                    <td>{p.enterprise.business_name}</td>
                                    <td>{p.category.name}</td>
                                    <td>
                                        ₱{Number(p.price).toLocaleString()} · {p.stock_quantity}
                                    </td>
                                    <td className="capitalize">{p.status.replace('_', ' ')}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                title="Publish"
                                                onClick={() => router.patch(route('admin.local-products.update', p.id), { status: 'published' })}
                                                className="rounded bg-emerald-50 p-2 text-emerald-700"
                                            >
                                                <Check />
                                            </button>
                                            <button
                                                title="Reject"
                                                onClick={() => {
                                                    const reason = prompt('Reason for rejection');
                                                    if (reason)
                                                        router.patch(route('admin.local-products.update', p.id), {
                                                            status: 'rejected',
                                                            rejection_reason: reason,
                                                        });
                                                }}
                                                className="rounded bg-red-50 p-2 text-red-700"
                                            >
                                                <X />
                                            </button>
                                            {p.status === 'published' && (
                                                <button
                                                    title="Feature"
                                                    onClick={() => router.patch(route('admin.local-products.feature', p.id))}
                                                    className="rounded bg-amber-50 p-2 text-amber-700"
                                                >
                                                    <Star fill={p.is_featured ? 'currentColor' : 'none'} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
