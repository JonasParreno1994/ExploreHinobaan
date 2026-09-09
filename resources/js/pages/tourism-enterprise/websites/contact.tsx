import InputError from '@/components/input-error';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const platforms = ['facebook', 'instagram', 'tiktok', 'youtube', 'x'] as const;
interface SocialLink {
    platform: string;
    url: string;
}

export default function Contact({
    enterprise,
    socialLinks,
}: {
    enterprise: WebsiteEnterprise;
    website: EnterpriseWebsite;
    socialLinks: SocialLink[];
}) {
    const form = useForm({
        email: enterprise.email,
        phone: enterprise.phone,
        website: enterprise.website ?? '',
        social_links: platforms.map((platform) => ({ platform, url: socialLinks.find((link) => link.platform === platform)?.url ?? '' })),
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(route('partner.websites.contact.update', enterprise.id));
    };
    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title="Contact and Social Media" />
            <div>
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Website content</p>
                <h1 className="mt-2 text-3xl font-extrabold">Contact & Social Media</h1>
            </div>
            <form onSubmit={submit} className="mt-6 grid gap-5 rounded-3xl border border-orange-100 bg-white p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold">
                        Email
                        <input
                            type="email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            className="h-11 rounded-xl border px-3"
                        />
                        <InputError message={form.errors.email} />
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                        Phone
                        <input
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            className="h-11 rounded-xl border px-3"
                        />
                        <InputError message={form.errors.phone} />
                    </label>
                </div>
                <label className="grid gap-2 text-sm font-bold">
                    Business website
                    <input
                        type="url"
                        value={form.data.website}
                        onChange={(e) => form.setData('website', e.target.value)}
                        placeholder="https://"
                        className="h-11 rounded-xl border px-3"
                    />
                    <InputError message={form.errors.website} />
                </label>
                <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
                    {form.data.social_links.map((link, index) => (
                        <label key={link.platform} className="grid gap-2 text-sm font-bold capitalize">
                            {link.platform}
                            <input
                                type="url"
                                value={link.url}
                                onChange={(e) =>
                                    form.setData(
                                        'social_links',
                                        form.data.social_links.map((item, itemIndex) =>
                                            itemIndex === index ? { ...item, url: e.target.value } : item,
                                        ),
                                    )
                                }
                                placeholder="https://"
                                className="h-11 rounded-xl border px-3"
                            />
                        </label>
                    ))}
                </div>
                <button disabled={form.processing} className="w-fit rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white">
                    Save contact details
                </button>
            </form>
        </WebsiteShell>
    );
}
