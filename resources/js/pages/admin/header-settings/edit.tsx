import { HeaderSettingForm, type HeaderSettingFormData } from '@/components/admin/header-setting-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

interface HeaderSetting
    extends Omit<HeaderSettingFormData, 'logo' | 'remove_logo' | 'social_image' | 'remove_social_image' | 'webapp_logo' | 'remove_webapp_logo'> {
    id: number;
    logo_url: string | null;
    social_image_url: string | null;
    webapp_logo_url: string | null;
}

export default function EditHeaderSetting({ headerSetting }: { headerSetting: HeaderSetting }) {
    const form = useForm<HeaderSettingFormData>({
        name: headerSetting.name,
        site_name: headerSetting.site_name,
        tagline: headerSetting.tagline,
        logo: null,
        remove_logo: false,
        social_image: null,
        remove_social_image: false,
        webapp_logo: null,
        remove_webapp_logo: false,
        login_label: headerSetting.login_label,
        register_label: headerSetting.register_label,
        status: headerSetting.status,
    });

    function submit(event: FormEvent): void {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.header-settings.update', headerSetting.id), {
            forceFormData: true,
        });
    }

    return (
        <AdminLayout
            title="Edit Header Settings"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Settings', href: '/admin/settings' },
                { title: 'Edit Header', href: `/admin/header-settings/${headerSetting.id}/edit` },
            ]}
        >
            <Head title="Edit Header Settings" />
            <Card className="mx-auto max-w-3xl">
                <CardHeader>
                    <CardTitle>Edit header configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <HeaderSettingForm
                            data={form.data}
                            errors={form.errors}
                            onChange={form.setData}
                            currentLogoUrl={headerSetting.logo_url}
                            currentSocialImageUrl={headerSetting.social_image_url}
                            currentWebappLogoUrl={headerSetting.webapp_logo_url}
                        />
                        {form.hasErrors && (
                            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                Some fields could not be saved. Review the messages above and try again.
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.settings')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700">
                                {form.processing ? 'Saving…' : 'Save changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
