import InputError from '@/components/input-error';
import { SiteLogo } from '@/components/site-brand';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({ email: '', password: '', remember: false });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937] lg:grid lg:grid-cols-[1.08fr_.92fr]">
            <Head title="Administrator Login | Explore Hinoba-an" />

            <section className="relative hidden min-h-screen overflow-hidden bg-[#0F766E] lg:flex lg:flex-col lg:justify-between">
                <img
                    src="/images/landing/hinobaan-hero.png"
                    alt="Hinoba-an coastal destination"
                    className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E]/95 via-[#0F766E]/80 to-slate-950/65" />

                <Link href={route('home')} className="relative z-10 flex items-center gap-3 p-10 text-white">
                    <SiteLogo className="size-14" />
                    <span>
                        <strong className="block text-lg leading-tight">Explore Hinoba-an</strong>
                        <small className="text-xs font-semibold tracking-[.18em] text-teal-100 uppercase">Tourism Portal</small>
                    </span>
                </Link>

                <div className="relative z-10 max-w-2xl px-10 pb-14 xl:px-16 xl:pb-20">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold tracking-[.16em] text-white uppercase backdrop-blur">
                        <ShieldCheck className="size-4 text-[#FBBF24]" /> Authorized personnel only
                    </span>
                    <h1 className="mt-6 text-4xl leading-tight font-extrabold text-white xl:text-6xl">Manage Hinoba-an’s tourism experience.</h1>
                    <p className="mt-5 max-w-xl text-base leading-8 text-teal-50/90 xl:text-lg">
                        Maintain destinations, tourism enterprises, events, community information, and public portal content from one secure
                        workspace.
                    </p>
                </div>
            </section>

            <main className="flex min-h-screen flex-col">
                <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:justify-end">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] transition hover:text-[#F97316]"
                    >
                        <ArrowLeft className="size-4" /> Back to tourism portal
                    </Link>
                    <span className="lg:hidden">
                        <SiteLogo className="size-11" />
                    </span>
                </div>

                <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-orange-50 text-[#F97316]">
                                <LockKeyhole className="size-6" />
                            </span>
                            <p className="mt-5 text-xs font-bold tracking-[.18em] text-[#F97316] uppercase">Administration</p>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome back</h2>
                            <p className="mt-3 text-sm leading-6 text-[#64748B]">
                                Sign in with your administrator account to continue to the dashboard.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-5 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-medium text-[#0F766E]">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="text-sm font-bold">
                                    Email address
                                </label>
                                <div className="relative mt-2">
                                    <Mail className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#94A3B8]" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        placeholder="administrator@example.com"
                                        className="h-13 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-12 text-sm transition outline-none placeholder:text-slate-400 focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <div className="flex items-center justify-between gap-4">
                                    <label htmlFor="password" className="text-sm font-bold">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-xs font-bold text-[#F97316] hover:text-[#C2410C]">
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative mt-2">
                                    <LockKeyhole className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#94A3B8]" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        placeholder="Enter your password"
                                        className="h-13 w-full rounded-xl border border-slate-200 bg-white pr-12 pl-12 text-sm transition outline-none placeholder:text-slate-400 focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        className="absolute top-1/2 right-4 -translate-y-1/2 text-[#64748B] transition hover:text-[#F97316]"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <label htmlFor="remember" className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#64748B]">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked === true)}
                                />
                                Keep me signed in on this device
                            </label>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-13 w-full rounded-xl bg-[#F97316] text-base font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-[#C2410C]"
                            >
                                {processing ? <LoaderCircle className="size-5 animate-spin" /> : <ShieldCheck className="size-5" />}
                                {processing ? 'Signing in...' : 'Sign in to dashboard'}
                            </Button>
                        </form>

                        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-[#64748B]">
                            <ShieldCheck className="size-4 text-[#0F766E]" /> Secure access for authorized Tourism Office personnel
                        </div>
                    </div>
                </div>
                <p className="px-5 pb-6 text-center text-xs text-[#94A3B8]">© 2026 Explore Hinoba-an Tourism Portal</p>
            </main>
        </div>
    );
}
