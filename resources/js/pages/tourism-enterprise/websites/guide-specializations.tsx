import InputError from '@/components/input-error';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Specialization { id: number; name: string; description: string | null; years_experience: number | null }

export default function GuideSpecializations({ enterprise, specializations }: { enterprise: WebsiteEnterprise; website: EnterpriseWebsite; specializations: Specialization[] }) {
    const form = useForm({ name: '', description: '', years_experience: '', is_active: true });
    const submit = (event: FormEvent) => { event.preventDefault(); form.post(route('partner.websites.guide-specializations.store', enterprise.id), { onSuccess: () => form.reset('name', 'description', 'years_experience') }); };
    return <WebsiteShell enterprise={enterprise}>
        <Head title="Guide Specializations" />
        <h1 className="text-3xl font-extrabold">Guide Specializations</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4 rounded-3xl border border-orange-100 bg-white p-6">
            <label className="grid gap-2 text-sm font-bold">Specialization<input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="h-11 rounded-xl border px-3" /><InputError message={form.errors.name} /></label>
            <label className="grid gap-2 text-sm font-bold">Description<textarea value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} rows={4} className="rounded-xl border p-3" /><InputError message={form.errors.description} /></label>
            <label className="grid gap-2 text-sm font-bold">Years of experience<input type="number" min="0" max="80" value={form.data.years_experience} onChange={(e) => form.setData('years_experience', e.target.value)} className="h-11 rounded-xl border px-3" /><InputError message={form.errors.years_experience} /></label>
            <button disabled={form.processing} className="w-fit rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">Add specialization</button>
        </form>
        <div className="mt-5 grid gap-3 md:grid-cols-2">{specializations.map((item) => <article key={item.id} className="rounded-2xl border border-orange-100 bg-white p-5"><div className="flex justify-between gap-3"><strong>{item.name}</strong><button type="button" onClick={() => router.delete(route('partner.websites.guide-specializations.destroy', [enterprise.id, item.id]))} className="text-xs font-bold text-red-600">Remove</button></div><p className="mt-2 text-sm text-slate-600">{item.description}</p>{item.years_experience !== null && <p className="mt-2 text-xs font-bold text-teal-700">{item.years_experience} years experience</p>}</article>)}</div>
    </WebsiteShell>;
}
