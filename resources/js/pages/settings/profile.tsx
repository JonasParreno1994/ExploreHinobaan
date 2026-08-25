import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { BadgeCheck, Check, Mail, UserRound } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const initials = auth.user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="bg-card relative overflow-hidden rounded-2xl border shadow-sm">
                        <div className="h-28 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 dark:from-emerald-700 dark:via-emerald-800 dark:to-teal-950" />
                        <div className="px-6 pb-6">
                            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                    <div className="border-card flex size-20 items-center justify-center rounded-2xl border-4 bg-emerald-50 text-xl font-semibold text-emerald-700 shadow-sm dark:bg-emerald-950 dark:text-emerald-200">
                                        {initials}
                                    </div>
                                    <div className="pb-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-semibold tracking-tight">{auth.user.name}</h2>
                                            {auth.user.email_verified_at && (
                                                <BadgeCheck className="size-4 text-emerald-600" aria-label="Verified account" />
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-sm">{auth.user.email}</p>
                                    </div>
                                </div>
                                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                    Active account
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border shadow-sm">
                        <div className="border-b px-6 py-5">
                            <HeadingSmall title="Personal information" description="Keep your account details accurate and up to date." />
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full name</Label>
                                <div className="relative">
                                    <UserRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                    <Input
                                        id="name"
                                        className="h-11 pl-10"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />
                                </div>

                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="email">Email address</Label>
                                    {auth.user.email_verified_at && (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            <Check className="size-3.5" /> Verified
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-11 pl-10"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />
                                </div>

                                <InputError message={errors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
                                    <p className="text-sm text-amber-900 dark:text-amber-100">
                                        Your email address is not verified yet.{' '}
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="font-semibold underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-hidden"
                                        >
                                            Resend verification email
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                            A new verification link has been sent to your email address.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4 border-t pt-5">
                                <Button
                                    disabled={processing}
                                    className="min-w-32 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500"
                                >
                                    {processing ? 'Saving…' : 'Save changes'}
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 -translate-x-1"
                                    leave="transition ease-in duration-150"
                                    leaveTo="opacity-0 -translate-x-1"
                                >
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                        <Check className="size-4" /> Saved
                                    </div>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
