import InputError from '@/components/input-error';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Itinerary { id: number; time: string | null; activity: string; destination: string | null; description: string | null; sort_order: number }
interface TourPackage { id: number; name: string; description: string | null; rate: string; inclusions: string | null; exclusions: string | null; image_url: string | null; itineraries: Itinerary[] }

export default function Tours({ enterprise, packages }: { enterprise: WebsiteEnterprise; website: EnterpriseWebsite; packages: TourPackage[] }) {
    const packageForm = useForm({ name: '', description: '', rate: '', inclusions: '', exclusions: '', image: null as File | null, is_available: true, is_featured: false });
    const itineraryForm = useForm({ enterprise_tour_package_id: packages[0]?.id ?? 0, time: '', activity: '', destination: '', description: '', sort_order: 0 });
    const addPackage = (event: FormEvent) => { event.preventDefault(); packageForm.post(route('partner.websites.tours.packages.store', enterprise.id), { forceFormData: true, onSuccess: () => packageForm.reset() }); };
    const addItinerary = (event: FormEvent) => { event.preventDefault(); itineraryForm.post(route('partner.websites.tours.itineraries.store', enterprise.id), { onSuccess: () => itineraryForm.reset('time', 'activity', 'destination', 'description') }); };
    return <WebsiteShell enterprise={enterprise}>
        <Head title="Tour Packages & Itineraries" />
        <h1 className="text-3xl font-extrabold">Tour Packages & Itineraries</h1>
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <form onSubmit={addPackage} className="grid gap-3 rounded-3xl border border-orange-100 bg-white p-6">
                <h2 className="font-extrabold">New tour package</h2>
                <TextField label="Package name" value={packageForm.data.name} error={packageForm.errors.name} onChange={(value) => packageForm.setData('name', value)} />
                <TextField label="Rate" type="number" value={packageForm.data.rate} error={packageForm.errors.rate} onChange={(value) => packageForm.setData('rate', value)} />
                <Area label="Description" value={packageForm.data.description} error={packageForm.errors.description} onChange={(value) => packageForm.setData('description', value)} />
                <Area label="Inclusions" value={packageForm.data.inclusions} error={packageForm.errors.inclusions} onChange={(value) => packageForm.setData('inclusions', value)} />
                <Area label="Exclusions" value={packageForm.data.exclusions} error={packageForm.errors.exclusions} onChange={(value) => packageForm.setData('exclusions', value)} />
                <label className="grid gap-2 text-sm font-bold">Cover image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => packageForm.setData('image', e.target.files?.[0] ?? null)} /><InputError message={packageForm.errors.image} /></label>
                <button disabled={packageForm.processing} className="w-fit rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">Add package</button>
            </form>
            <form onSubmit={addItinerary} className="grid content-start gap-3 rounded-3xl border border-orange-100 bg-white p-6">
                <h2 className="font-extrabold">Add itinerary item</h2>
                <label className="grid gap-2 text-sm font-bold">Package<select value={itineraryForm.data.enterprise_tour_package_id} onChange={(e) => itineraryForm.setData('enterprise_tour_package_id', Number(e.target.value))} className="h-11 rounded-xl border px-3"><option value={0}>Select package</option>{packages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><InputError message={itineraryForm.errors.enterprise_tour_package_id} /></label>
                <TextField label="Time" type="time" value={itineraryForm.data.time} error={itineraryForm.errors.time} onChange={(value) => itineraryForm.setData('time', value)} />
                <TextField label="Activity" value={itineraryForm.data.activity} error={itineraryForm.errors.activity} onChange={(value) => itineraryForm.setData('activity', value)} />
                <TextField label="Destination" value={itineraryForm.data.destination} error={itineraryForm.errors.destination} onChange={(value) => itineraryForm.setData('destination', value)} />
                <Area label="Description" value={itineraryForm.data.description} error={itineraryForm.errors.description} onChange={(value) => itineraryForm.setData('description', value)} />
                <button disabled={itineraryForm.processing || packages.length === 0} className="w-fit rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white">Add itinerary item</button>
            </form>
        </div>
        <div className="mt-6 grid gap-5">{packages.map((item) => <section key={item.id} className="rounded-3xl border border-orange-100 bg-white p-6"><div className="flex justify-between gap-4"><div><h2 className="text-xl font-extrabold">{item.name}</h2><p className="text-sm text-slate-600">{item.description}</p></div><strong className="text-teal-700">₱{Number(item.rate).toLocaleString('en-PH')}</strong></div><ol className="mt-4 grid gap-2">{item.itineraries.map((step) => <li key={step.id} className="flex gap-3 rounded-xl bg-slate-50 p-3"><strong className="text-orange-700">{step.time?.slice(0, 5) || '—'}</strong><div className="flex-1"><b>{step.activity}</b>{step.destination && <p className="text-xs text-slate-500">{step.destination}</p>}</div><button type="button" onClick={() => router.delete(route('partner.websites.tours.itineraries.destroy', [enterprise.id, step.id]))} className="text-xs font-bold text-red-600">Remove</button></li>)}</ol></section>)}</div>
    </WebsiteShell>;
}

function TextField({ label, value, onChange, error, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string }) { return <label className="grid gap-2 text-sm font-bold">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-xl border px-3" /><InputError message={error} /></label>; }
function Area({ label, value, onChange, error }: { label: string; value: string; onChange: (value: string) => void; error?: string }) { return <label className="grid gap-2 text-sm font-bold">{label}<textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="rounded-xl border p-3" /><InputError message={error} /></label>; }
