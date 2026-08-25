import { FooterSettingForm, type FooterSettingFormData } from '@/components/admin/footer-setting-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { type FooterSetting } from './index';
export default function EditFooterSetting({ footerSetting }: { footerSetting: FooterSetting }) {
    const form = useForm<FooterSettingFormData>({
        ...footerSetting,
        facebook_url: footerSetting.facebook_url ?? '',
        instagram_url: footerSetting.instagram_url ?? '',
        youtube_url: footerSetting.youtube_url ?? '',
    });
    function submit(event: FormEvent) {
        event.preventDefault();
        form.put(route('admin.footer-settings.update', footerSetting.id));
    }
    return (
        <AdminLayout
            title="Edit Footer"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Footer', href: '/admin/footer-settings' },
                { title: 'Edit', href: `/admin/footer-settings/${footerSetting.id}/edit` },
            ]}
        >
            <Head title="Edit Footer" />
            <Card className="mx-auto max-w-4xl">
                <CardHeader>
                    <CardTitle>Edit footer configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <FooterSettingForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.footer-settings.index')}>Cancel</Link>
                            </Button>
                            <Button disabled={form.processing} className="bg-emerald-700">
                                Save changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
