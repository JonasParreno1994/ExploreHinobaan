import InputError from '@/components/input-error';
import { SiteLogo } from '@/components/site-brand';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, TrendingUp, Users } from 'lucide-react';
import { type FormEvent, useState } from 'react';

export default function PartnerLogin({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const form = useForm({ email: '', password: '', remember: false });
    const [showPassword, setShowPassword] = useState(false);
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('partner.login.store'), { onFinish: () => form.reset('password') });
    }

    return (
        <div className="min-h-screen bg-[#FFFBF5] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
            <Head title="Tourism Enterprise Partner Login" />
            <section className="relative hidden overflow-hidden bg-[#0F766E] px-12 py-16 text-white lg:flex lg:flex-col lg:justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,.28),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,.35),transparent_42%)]" />
                <div className="relative mx-auto max-w-xl">
                    <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-white/15">
                        <Building2 className="size-8" />
                    </span>
                    <h1 className="mt-8 text-5xl leading-tight font-extrabold">Partner with Explore Hinoba-an</h1>
                    <p className="mt-4 text-xl font-semibold text-[#FBBF24]">Grow your tourism enterprise</p>
                    <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">
                        Connect with travelers, showcase your services, and become part of Hinoba-an’s official tourism network.
                    </p>
                    <div className="mt-9 grid gap-4">
                        {[
                            [TrendingUp, 'Increase your business visibility'],
                            [Users, 'Reach tourists planning their visit'],
                            [CheckCircle2, 'Build trust through LGU verification'],
                        ].map(([Icon, text]) => {
                            const FeatureIcon = Icon as typeof TrendingUp;
                            return (
                                <div key={text as string} className="flex items-center gap-3">
                                    <FeatureIcon className="size-5 text-[#FBBF24]" />
                                    <span>{text as string}</span>
                                </div>
                            );
                        })}
                    </div>
                    <Button asChild className="mt-10 h-12 w-full bg-white font-bold text-[#0F766E] hover:bg-[#FFF3E6]">
                        <Link href={route('partner.register')}>
                            <Building2 /> Register as a Tourism Enterprise
                        </Link>
                    </Button>
                </div>
            </section>
            <section className="relative flex min-h-screen items-center justify-center px-5 py-16 sm:px-10">
                <Link href={route('home')} className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E]">
                    <ArrowLeft className="size-4" /> Home
                </Link>
                <div className="w-full max-w-md">
                    <div className="text-center">
                        <SiteLogo className="mx-auto size-20" />
                        <h2 className="mt-6 text-3xl font-extrabold">Tourism Enterprise Portal</h2>
                        <p className="mt-2 text-[#64748B]">Sign in to your partner account</p>
                    </div>
                    {status && <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{status}</p>}
                    <form onSubmit={submit} className="mt-8 grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#64748B]" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    className="h-12 pl-12"
                                    required
                                    autoFocus
                                />
                            </div>
                            <InputError message={form.errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password">Password</Label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-xs font-bold text-[#F97316]">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <LockKeyhole className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#64748B]" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    className="h-12 px-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[#64748B]"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                            <InputError message={form.errors.password} />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox checked={form.data.remember} onCheckedChange={(value) => form.setData('remember', Boolean(value))} /> Remember
                            me
                        </label>
                        <Button disabled={form.processing} className="h-12 bg-[#F97316] font-bold hover:bg-[#C2410C]">
                            {form.processing && <LoaderCircle className="animate-spin" />} Sign In
                        </Button>
                    </form>
                    <div className="mt-8 border-t pt-7 text-center">
                        <p className="text-sm text-[#64748B]">Don’t have a partner account?</p>
                        <Button asChild variant="outline" className="mt-3 h-12 w-full border-[#0F766E] font-bold text-[#0F766E]">
                            <Link href={route('partner.register')}>
                                <Building2 /> Register your enterprise
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
