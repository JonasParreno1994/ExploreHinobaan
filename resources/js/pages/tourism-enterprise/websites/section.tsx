import InputError from '@/components/input-error';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Section {
    section_type: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    is_visible: boolean;
}

export default function SectionEditor({
    enterprise,
    section,
    sectionLabel,
}: {
    enterprise: WebsiteEnterprise;
    website: EnterpriseWebsite;
    section: Section;
    sectionLabel: string;
}) {
    const form = useForm({
        title: section.title ?? '',
        subtitle: section.subtitle ?? '',
        content: section.content ?? '',
        is_visible: section.is_visible,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(route('partner.websites.sections.update', [enterprise.id, section.section_type]));
    };
    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title={sectionLabel} />
            <form onSubmit={submit}>
                <div>
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Website content</p>
                    <h1 className="mt-2 text-3xl font-extrabold">{sectionLabel}</h1>
                </div>
                <div className="mt-6 grid gap-5 rounded-3xl border border-orange-100 bg-white p-6">
                    <label className="grid gap-2 text-sm font-bold">
                        Section title
                        <input
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="h-11 rounded-xl border px-3"
                        />
                        <InputError message={form.errors.title} />
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                        Subtitle
                        <input
                            value={form.data.subtitle}
                            onChange={(e) => form.setData('subtitle', e.target.value)}
                            className="h-11 rounded-xl border px-3"
                        />
                        <InputError message={form.errors.subtitle} />
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                        Content
                        <textarea
                            value={form.data.content}
                            onChange={(e) => form.setData('content', e.target.value)}
                            rows={12}
                            className="rounded-xl border p-3 font-normal"
                        />
                        <InputError message={form.errors.content} />
                    </label>
                    <label className="flex items-center gap-3 text-sm font-bold">
                        <input
                            type="checkbox"
                            checked={form.data.is_visible}
                            onChange={(e) => form.setData('is_visible', e.target.checked)}
                            className="size-5"
                        />{' '}
                        Display this section publicly
                    </label>
                    <button disabled={form.processing} className="w-fit rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white">
                        Save {sectionLabel}
                    </button>
                </div>
            </form>
        </WebsiteShell>
    );
}
