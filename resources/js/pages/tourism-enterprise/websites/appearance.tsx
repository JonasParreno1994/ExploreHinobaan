import { ImageUploader } from '@/components/admin/image-uploader';
import InputError from '@/components/input-error';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface FormData {
    template: string;
    tagline: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    logo: File | null;
    cover_image: File | null;
    remove_logo: boolean;
    remove_cover_image: boolean;
}

export default function Appearance({
    enterprise,
    website,
    templates,
}: {
    enterprise: WebsiteEnterprise;
    website: EnterpriseWebsite;
    templates: { value: string; label: string }[];
}) {
    const form = useForm<FormData>({
        template: website.template,
        tagline: website.tagline ?? '',
        primary_color: website.primary_color,
        secondary_color: website.secondary_color,
        accent_color: website.accent_color,
        logo: null,
        cover_image: null,
        remove_logo: false,
        remove_cover_image: false,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('partner.websites.appearance.update', enterprise.id), { forceFormData: true });
    };
    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title="Website Appearance" />
            <form onSubmit={submit} className="grid gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">My Website</p>
                    <h1 className="mt-2 text-3xl font-extrabold">Appearance</h1>
                </div>
                <div className="grid gap-6 rounded-3xl border border-orange-100 bg-white p-6">
                    <label className="grid gap-2 text-sm font-bold">
                        Website template
                        <select
                            value={form.data.template}
                            onChange={(e) => form.setData('template', e.target.value)}
                            className="h-11 rounded-xl border px-3"
                        >
                            {templates.map((template) => (
                                <option key={template.value} value={template.value}>
                                    {template.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.template} />
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                        Tagline
                        <input
                            value={form.data.tagline}
                            onChange={(e) => form.setData('tagline', e.target.value)}
                            maxLength={160}
                            className="h-11 rounded-xl border px-3"
                        />
                        <InputError message={form.errors.tagline} />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {(['primary_color', 'secondary_color', 'accent_color'] as const).map((field) => (
                            <label key={field} className="grid gap-2 text-sm font-bold capitalize">
                                {field.replace('_', ' ')}
                                <input
                                    type="color"
                                    value={form.data[field]}
                                    onChange={(e) => form.setData(field, e.target.value)}
                                    className="h-12 w-full rounded-xl border p-1"
                                />
                                <InputError message={form.errors[field]} />
                            </label>
                        ))}
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="grid gap-2">
                            <span className="text-sm font-bold">Business logo</span>
                            {website.logo_url && !form.data.remove_logo && (
                                <img src={website.logo_url} className="size-24 rounded-2xl object-cover" alt="Current website logo" />
                            )}
                            <ImageUploader
                                files={form.data.logo ? [form.data.logo] : []}
                                onChange={(files) => {
                                    form.setData('logo', files[0] ?? null);
                                    form.setData('remove_logo', false);
                                }}
                                multiple={false}
                                maxFiles={1}
                                maxSizeMb={2}
                                error={form.errors.logo}
                            />
                            {website.logo_url && (
                                <button
                                    type="button"
                                    onClick={() => form.setData('remove_logo', true)}
                                    className="text-left text-xs font-bold text-red-600"
                                >
                                    Remove current logo
                                </button>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <span className="text-sm font-bold">Cover photo</span>
                            {website.cover_image_url && !form.data.remove_cover_image && (
                                <img src={website.cover_image_url} className="h-24 w-full rounded-2xl object-cover" alt="Current cover" />
                            )}
                            <ImageUploader
                                files={form.data.cover_image ? [form.data.cover_image] : []}
                                onChange={(files) => {
                                    form.setData('cover_image', files[0] ?? null);
                                    form.setData('remove_cover_image', false);
                                }}
                                multiple={false}
                                maxFiles={1}
                                maxSizeMb={5}
                                error={form.errors.cover_image}
                            />
                            {website.cover_image_url && (
                                <button
                                    type="button"
                                    onClick={() => form.setData('remove_cover_image', true)}
                                    className="text-left text-xs font-bold text-red-600"
                                >
                                    Remove current cover
                                </button>
                            )}
                        </div>
                    </div>
                    <button disabled={form.processing} className="w-fit rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white">
                        Save appearance
                    </button>
                </div>
            </form>
        </WebsiteShell>
    );
}
