import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { GripVertical, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import { type FormEvent, type ReactNode } from 'react';

interface WhyVisitCard {
    title: string;
    description: string;
    icon: string;
}

interface WhyVisitSection {
    eyebrow: string;
    title: string;
    subtitle: string | null;
    cards: WhyVisitCard[];
    status: 'active' | 'inactive';
}

const iconOptions = [
    ['trees', 'Natural wonders'],
    ['sparkles', 'Culture'],
    ['compass', 'Adventure'],
    ['umbrella', 'Relaxation'],
    ['waves', 'Ocean'],
    ['mountain', 'Mountain'],
    ['heart', 'Hospitality'],
    ['camera', 'Photography'],
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Why Visit', href: '/admin/why-visit' },
];

export default function EditWhyVisitSection({ section }: { section: WhyVisitSection }) {
    const form = useForm({
        eyebrow: section.eyebrow,
        title: section.title,
        subtitle: section.subtitle ?? '',
        cards: section.cards,
        status: section.status,
    });

    const updateCard = (index: number, field: keyof WhyVisitCard, value: string) => {
        form.setData(
            'cards',
            form.data.cards.map((card, cardIndex) => (cardIndex === index ? { ...card, [field]: value } : card)),
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(route('admin.why-visit.update'), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Why Visit Hinoba-an" breadcrumbs={breadcrumbs}>
            <Head title="Edit Why Visit Section" />
            <form onSubmit={submit} className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="text-[#F97316]" /> Why Visit section
                        </CardTitle>
                        <CardDescription>Edit the heading and promotional cards displayed on the public landing page.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2">
                        <Field label="Eyebrow" error={form.errors.eyebrow}>
                            <input
                                value={form.data.eyebrow}
                                onChange={(e) => form.setData('eyebrow', e.target.value)}
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </Field>
                        <Field label="Section title" error={form.errors.title}>
                            <input
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </Field>
                        <Field label="Subtitle" error={form.errors.subtitle} className="md:col-span-2">
                            <textarea
                                value={form.data.subtitle}
                                onChange={(e) => form.setData('subtitle', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </Field>
                        <Field label="Public status" error={form.errors.status}>
                            <select
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value as 'active' | 'inactive')}
                                className="w-full rounded-lg border px-3 py-2"
                            >
                                <option value="active">Active — displayed publicly</option>
                                <option value="inactive">Inactive — use default content</option>
                            </select>
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Promotional cards</CardTitle>
                            <CardDescription>Add up to eight reasons for visitors to explore Hinoba-an.</CardDescription>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={form.data.cards.length >= 8}
                            onClick={() => form.setData('cards', [...form.data.cards, { title: '', description: '', icon: 'sparkles' }])}
                        >
                            <Plus /> Add card
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {form.data.cards.map((card, index) => (
                            <article key={index} className="rounded-2xl border bg-slate-50/50 p-5">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <GripVertical className="size-4" /> Card {index + 1}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={form.data.cards.length === 1}
                                        onClick={() =>
                                            form.setData(
                                                'cards',
                                                form.data.cards.filter((_, cardIndex) => cardIndex !== index),
                                            )
                                        }
                                        aria-label={`Remove card ${index + 1}`}
                                    >
                                        <Trash2 className="text-red-600" />
                                    </Button>
                                </div>
                                <div className="grid gap-4">
                                    <Field label="Title" error={form.errors[`cards.${index}.title`]}>
                                        <input
                                            value={card.title}
                                            onChange={(e) => updateCard(index, 'title', e.target.value)}
                                            className="w-full rounded-lg border bg-white px-3 py-2"
                                        />
                                    </Field>
                                    <Field label="Description" error={form.errors[`cards.${index}.description`]}>
                                        <textarea
                                            value={card.description}
                                            onChange={(e) => updateCard(index, 'description', e.target.value)}
                                            rows={4}
                                            className="w-full rounded-lg border bg-white px-3 py-2"
                                        />
                                    </Field>
                                    <Field label="Icon" error={form.errors[`cards.${index}.icon`]}>
                                        <select
                                            value={card.icon}
                                            onChange={(e) => updateCard(index, 'icon', e.target.value)}
                                            className="w-full rounded-lg border bg-white px-3 py-2"
                                        >
                                            {iconOptions.map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>
                            </article>
                        ))}
                        {form.errors.cards && <p className="text-sm text-red-600 md:col-span-2">{form.errors.cards}</p>}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing} className="bg-emerald-700 hover:bg-emerald-800">
                        <Save /> Save changes
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, error, className = '', children }: { label: string; error?: string; className?: string; children: ReactNode }) {
    return (
        <label className={`grid gap-1.5 text-sm font-medium ${className}`}>
            {label}
            {children}
            {error && <span className="text-xs text-red-600">{error}</span>}
        </label>
    );
}
