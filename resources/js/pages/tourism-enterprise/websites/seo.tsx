import { ImageUploader } from '@/components/admin/image-uploader';
import InputError from '@/components/input-error';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Seo({ enterprise, website }: { enterprise: WebsiteEnterprise; website: EnterpriseWebsite }) {
    const form = useForm<{ seo_title: string; seo_description: string; social_title: string; social_description: string; social_image: File | null; remove_social_image: boolean }>({
        seo_title: website.seo_title ?? '',
        seo_description: website.seo_description ?? '',
        social_title: website.social_title ?? '',
        social_description: website.social_description ?? '',
        social_image: null,
        remove_social_image: false,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('partner.websites.seo.update', enterprise.id), { forceFormData: true });
    };
    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title="SEO and Sharing" />
            <div>
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Website discovery</p>
                <h1 className="mt-2 text-3xl font-extrabold">SEO & Sharing</h1>
            </div>
            <form onSubmit={submit} className="mt-6 grid gap-5 rounded-3xl border border-orange-100 bg-white p-6">
                <label className="grid gap-2 text-sm font-bold">
                    Search title <span className="font-normal text-slate-500">({form.data.seo_title.length}/60)</span>
                    <input
                        value={form.data.seo_title}
                        maxLength={60}
                        onChange={(e) => form.setData('seo_title', e.target.value)}
                        className="h-11 rounded-xl border px-3"
                    />
                    <InputError message={form.errors.seo_title} />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                    Search description <span className="font-normal text-slate-500">({form.data.seo_description.length}/160)</span>
                    <textarea
                        value={form.data.seo_description}
                        maxLength={160}
                        onChange={(e) => form.setData('seo_description', e.target.value)}
                        rows={4}
                        className="rounded-xl border p-3 font-normal"
                    />
                    <InputError message={form.errors.seo_description} />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                    Social sharing title <span className="font-normal text-slate-500">({form.data.social_title.length}/95)</span>
                    <input value={form.data.social_title} maxLength={95} onChange={(e) => form.setData('social_title', e.target.value)} className="h-11 rounded-xl border px-3" />
                    <InputError message={form.errors.social_title} />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                    Social sharing description <span className="font-normal text-slate-500">({form.data.social_description.length}/200)</span>
                    <textarea value={form.data.social_description} maxLength={200} onChange={(e) => form.setData('social_description', e.target.value)} rows={4} className="rounded-xl border p-3 font-normal" />
                    <InputError message={form.errors.social_description} />
                </label>
                <div className="grid gap-2">
                    <span className="text-sm font-bold">Social sharing image</span>
                    {website.social_image_url && !form.data.remove_social_image && (
                        <img
                            src={website.social_image_url}
                            className="aspect-[1200/630] w-full max-w-xl rounded-2xl object-cover"
                            alt="Current social preview"
                        />
                    )}
                    <ImageUploader
                        files={form.data.social_image ? [form.data.social_image] : []}
                        onChange={(files) => {
                            form.setData('social_image', files[0] ?? null);
                            form.setData('remove_social_image', false);
                        }}
                        multiple={false}
                        maxFiles={1}
                        maxSizeMb={5}
                        error={form.errors.social_image}
                    />
                    <p className="text-xs text-slate-500">Recommended: 1200 × 630 pixels.</p>
                    {website.social_image_url && (
                        <button
                            type="button"
                            onClick={() => form.setData('remove_social_image', true)}
                            className="text-left text-xs font-bold text-red-600"
                        >
                            Remove current sharing image
                        </button>
                    )}
                </div>
                <button disabled={form.processing} className="w-fit rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white">
                    Save SEO settings
                </button>
            </form>
        </WebsiteShell>
    );
}
