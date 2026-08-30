import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Type } from 'lucide-react';
import { type FormEvent } from 'react';

interface PermanentText {
    header_1: string | null;
    header_2: string | null;
    header_3: string | null;
}

export default function TextIndex({ text }: { text: PermanentText | null }) {
    const form = useForm({ header_1: text?.header_1 ?? '', header_2: text?.header_2 ?? '', header_3: text?.header_3 ?? '' });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Text', href: '/admin/text' },
    ];

    function submit(event: FormEvent): void {
        event.preventDefault();
        form.put(route('admin.text.update'), { preserveScroll: true });
    }

    return (
        <AdminLayout title="Text" breadcrumbs={breadcrumbs}>
            <Head title="Text" />
            <Card className="mx-auto w-full max-w-3xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Type className="text-emerald-700" />
                        Permanent landing-page text
                    </CardTitle>
                    <CardDescription>This text stays fixed while the banner pictures rotate behind it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="header_1">Header 1</Label>
                            <Input
                                id="header_1"
                                value={form.data.header_1}
                                onChange={(event) => form.setData('header_1', event.target.value)}
                                placeholder="Southern Negros Occidental"
                            />
                            <InputError message={form.errors.header_1} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="header_2">Header 2</Label>
                            <Input
                                id="header_2"
                                value={form.data.header_2}
                                onChange={(event) => form.setData('header_2', event.target.value)}
                                placeholder="Discover the Beauty of Hinoba-an"
                            />
                            <InputError message={form.errors.header_2} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="header_3">Header 3</Label>
                            <textarea
                                id="header_3"
                                rows={5}
                                value={form.data.header_3}
                                onChange={(event) => form.setData('header_3', event.target.value)}
                                placeholder="Add the permanent supporting description."
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                            />
                            <InputError message={form.errors.header_3} />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.processing} className="bg-emerald-700">
                                Save text
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
