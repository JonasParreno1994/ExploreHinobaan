import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Facebook, Instagram, Mail, MapPin, Pencil, Phone, Youtube } from 'lucide-react';
import { type FooterSetting } from './index';
export default function ShowFooterSetting({ footerSetting }: { footerSetting: FooterSetting }) {
    return (
        <AdminLayout
            title="Footer Details"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Footer', href: '/admin/footer-settings' },
                { title: footerSetting.name, href: `/admin/footer-settings/${footerSetting.id}` },
            ]}
        >
            <Head title={footerSetting.name} />
            <Card className="mx-auto max-w-4xl">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>{footerSetting.name}</CardTitle>
                    <Button asChild className="bg-emerald-700">
                        <Link href={route('admin.footer-settings.edit', footerSetting.id)}>
                            <Pencil />
                            Edit
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-7">
                    <div className="rounded-xl bg-emerald-950 p-6 text-white">
                        <h2 className="text-xl font-bold">Explore Hinoba-an</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{footerSetting.description}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <p className="flex gap-3">
                            <MapPin className="size-5 text-emerald-700" />
                            <span>
                                <strong className="block">{footerSetting.office}</strong>
                                <small>
                                    {footerSetting.municipality}
                                    <br />
                                    {footerSetting.address}
                                </small>
                            </span>
                        </p>
                        <div className="grid gap-3 text-sm">
                            <p className="flex items-center gap-2">
                                <Mail className="size-4 text-emerald-700" />
                                {footerSetting.email}
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="size-4 text-emerald-700" />
                                {footerSetting.phone}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {footerSetting.facebook_url && (
                            <a href={footerSetting.facebook_url} target="_blank" rel="noreferrer">
                                <Facebook />
                            </a>
                        )}
                        {footerSetting.instagram_url && (
                            <a href={footerSetting.instagram_url} target="_blank" rel="noreferrer">
                                <Instagram />
                            </a>
                        )}
                        {footerSetting.youtube_url && (
                            <a href={footerSetting.youtube_url} target="_blank" rel="noreferrer">
                                <Youtube />
                            </a>
                        )}
                    </div>
                    <p className="text-muted-foreground border-t pt-5 text-sm">{footerSetting.copyright_text}</p>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
