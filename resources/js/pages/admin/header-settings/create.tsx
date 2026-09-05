import { HeaderSettingForm, type HeaderSettingFormData } from '@/components/admin/header-setting-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

export default function CreateHeaderSetting() {
    const form = useForm<HeaderSettingFormData>({
        name: 'Main Tourism Header',
        site_name: 'Explore Hinoba-an',
        tagline: 'Tourism Portal',
        logo: null,
        remove_logo: false,
        social_image: null,
        remove_social_image: false,
        login_label: 'Login',
        register_label: 'Register',
        status: 'active',
    });

    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('admin.header-settings.store'), { forceFormData: true });
    }

    return (
        <AdminLayout
            title="Create Header Settings"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Settings', href: '/admin/settings' },
                { title: 'Create Header', href: '/admin/header-settings/create' },
            ]}
        >
            <Head title="Create Header Settings" />
            <Card className="mx-auto max-w-3xl">
                <CardHeader>
                    <CardTitle>Create header configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <HeaderSettingForm data={form.data} errors={form.errors} onChange={form.setData} />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.settings')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700">
                                {form.processing ? 'Creating…' : 'Create header'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
