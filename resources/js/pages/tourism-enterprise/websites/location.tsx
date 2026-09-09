import InputError from '@/components/input-error';
import DestinationMap from '@/components/landing/destination-map';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Location({ enterprise }: { enterprise: WebsiteEnterprise; website: EnterpriseWebsite }) {
    const form = useForm({ address: enterprise.address, latitude: enterprise.latitude ?? '', longitude: enterprise.longitude ?? '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(route('partner.websites.location.update', enterprise.id));
    };
    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title="Website Location" />
            <div>
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Website content</p>
                <h1 className="mt-2 text-3xl font-extrabold">Location</h1>
            </div>
            <form onSubmit={submit} className="mt-6 grid gap-5 rounded-3xl border border-orange-100 bg-white p-6">
                <label className="grid gap-2 text-sm font-bold">
                    Complete address
                    <textarea
                        value={form.data.address}
                        onChange={(e) => form.setData('address', e.target.value)}
                        rows={3}
                        className="rounded-xl border p-3 font-normal"
                    />
                    <InputError message={form.errors.address} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold">
                        Latitude
                        <input
                            type="number"
                            step="any"
                            value={form.data.latitude}
                            onChange={(e) => form.setData('latitude', e.target.value)}
                            className="h-11 rounded-xl border px-3"
                        />
                        <InputError message={form.errors.latitude} />
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                        Longitude
                        <input
                            type="number"
                            step="any"
                            value={form.data.longitude}
                            onChange={(e) => form.setData('longitude', e.target.value)}
                            className="h-11 rounded-xl border px-3"
                        />
                        <InputError message={form.errors.longitude} />
                    </label>
                </div>
                <DestinationMap
                    name={enterprise.business_name}
                    address={form.data.address}
                    latitude={form.data.latitude}
                    longitude={form.data.longitude}
                />
                <button disabled={form.processing} className="w-fit rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white">
                    Save location
                </button>
            </form>
        </WebsiteShell>
    );
}
