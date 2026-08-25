import { FooterSettingForm, type FooterSettingFormData } from '@/components/admin/footer-setting-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const defaults: FooterSettingFormData = {
    name: 'Main Tourism Footer',
    description: '',
    municipality: 'Municipality of Hinoba-an',
    office: 'Municipal Tourism Office',
    address: 'Hinoba-an, Negros Occidental, Philippines',
    email: '',
    phone: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    copyright_text: '© 2026 Explore Hinoba-an. All Rights Reserved.',
    status: 'active',
};
export default function CreateFooterSetting() {
    const form = useForm(defaults);
    function submit(event: FormEvent) {
        event.preventDefault();
        form.post(route('admin.footer-settings.store'));
    }
    return (
        <AdminLayout
            title="Create Footer"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Footer', href: '/admin/footer-settings' },
                { title: 'Create', href: '/admin/footer-settings/create' },
            ]}
        >
            <Head title="Create Footer" />
            <Card className="mx-auto max-w-4xl">
                <CardHeader>
                    <CardTitle>Create footer configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <FooterSettingForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.footer-settings.index')}>Cancel</Link>
                            </Button>
                            <Button disabled={form.processing} className="bg-emerald-700">
                                Create footer
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
