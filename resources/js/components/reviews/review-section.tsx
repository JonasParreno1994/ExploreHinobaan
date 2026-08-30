import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { BadgeCheck, Star } from 'lucide-react';
import { type FormEvent } from 'react';

export interface PublicReview { id: number; reviewer_name: string; rating: number; title: string | null; comment: string; is_verified: boolean; created_at: string }
export interface ReviewSummary { average: number; count: number }

export function ReviewSection({ targetType, targetId, reviews, summary }: { targetType: 'destination' | 'enterprise' | 'service' | 'product'; targetId: number; reviews: PublicReview[]; summary: ReviewSummary }) {
    const { auth } = usePage<SharedData>().props;
    const form = useForm({ target_type: targetType, target_id: targetId, reviewer_name: auth.user?.name ?? '', reviewer_email: auth.user?.email ?? '', rating: 5, title: '', comment: '', reference_number: '' });
    const needsReference = targetType !== 'destination';
    const submit = (event: FormEvent) => { event.preventDefault(); form.post('/reviews', { preserveScroll: true, onSuccess: () => form.reset('title', 'comment', 'reference_number') }); };

    return <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[.2em] text-[#F97316] uppercase">Tourist feedback</p><h2 className="mt-2 text-2xl font-extrabold">Reviews & Feedback</h2></div><div className="text-right"><p className="text-3xl font-black text-[#0F766E]">{summary.count ? summary.average.toFixed(1) : '—'}</p><p className="text-sm text-[#64748B]">{summary.count} published review{summary.count === 1 ? '' : 's'}</p></div></div>
        <div className="mt-7 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
            <div className="space-y-4">{reviews.length ? reviews.map(review => <article key={review.id} className="rounded-2xl bg-[#FFFBF5] p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><strong>{review.reviewer_name}</strong>{review.is_verified && <span className="flex items-center gap-1 text-xs font-semibold text-[#0F766E]"><BadgeCheck className="size-4" /> Verified customer</span>}</div><span className="flex gap-0.5">{[1,2,3,4,5].map(star => <Star key={star} className={`size-4 ${star <= review.rating ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-slate-300'}`} />)}</span></div>{review.title && <h3 className="mt-3 font-bold">{review.title}</h3>}<p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#64748B]">{review.comment}</p><time className="mt-3 block text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString('en-PH')}</time></article>) : <div className="rounded-2xl bg-[#FFFBF5] p-8 text-center text-[#64748B]">No published reviews yet. Be the first to share feedback.</div>}</div>
            <form onSubmit={submit} className="space-y-4 rounded-2xl border border-orange-100 p-5"><h3 className="text-lg font-bold">Write a review</h3><p className="text-xs text-[#64748B]">Reviews are checked by the Tourism Office before publication.</p>
                <div className="grid gap-3 sm:grid-cols-2"><Field label="Your name" value={form.data.reviewer_name} error={form.errors.reviewer_name} onChange={v => form.setData('reviewer_name', v)} /><Field label="Email address" type="email" value={form.data.reviewer_email} error={form.errors.reviewer_email} onChange={v => form.setData('reviewer_email', v)} /></div>
                {needsReference && <Field label="Completed reservation/order number" value={form.data.reference_number} error={form.errors.reference_number} onChange={v => form.setData('reference_number', v)} placeholder="Example: HIN-2026-..." />}
                <label className="block text-sm font-semibold">Rating<select value={form.data.rating} onChange={e => form.setData('rating', Number(e.target.value))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal"><option value={5}>5 — Excellent</option><option value={4}>4 — Very good</option><option value={3}>3 — Good</option><option value={2}>2 — Fair</option><option value={1}>1 — Poor</option></select></label>
                <Field label="Review title (optional)" value={form.data.title} error={form.errors.title} onChange={v => form.setData('title', v)} />
                <label className="block text-sm font-semibold">Feedback<textarea value={form.data.comment} onChange={e => form.setData('comment', e.target.value)} rows={5} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal" />{form.errors.comment && <small className="text-red-600">{form.errors.comment}</small>}</label>
                <button disabled={form.processing} className="w-full rounded-xl bg-[#F97316] px-5 py-3 font-bold text-white disabled:opacity-60">{form.processing ? 'Submitting...' : 'Submit Review'}</button>
            </form>
        </div>
    </section>;
}

function Field({ label, value, onChange, error, type = 'text', placeholder }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string; placeholder?: string }) { return <label className="block text-sm font-semibold">{label}<input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal" />{error && <small className="text-red-600">{error}</small>}</label>; }
