import { FilterSelect } from '@/components/admin/filter-select';
import { FormError } from '@/components/admin/form-error';
import { ImageUploader } from '@/components/admin/image-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface EventFormData {
    barangay_id: string;
    title: string;
    event_type: string;
    short_description: string;
    description: string;
    venue: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    featured_image: File | null;
    registration_link: string;
    organizer: string;
    contact_number: string;
    status: string;
    is_featured: boolean;
}

interface NamedOption {
    id: number;
    name: string;
    status?: string;
}

export function EventForm({
    data,
    errors,
    barangays,
    eventTypes,
    onChange,
}: {
    data: EventFormData;
    errors: Record<string, string | undefined>;
    barangays: NamedOption[];
    eventTypes: string[];
    onChange: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
}) {
    const fieldClass = 'grid gap-2';

    return (
        <div className="grid gap-6">
            <section className="grid gap-5 rounded-xl border p-5">
                <div>
                    <h3 className="font-semibold">Event details</h3>
                    <p className="text-muted-foreground text-sm">Add the public details and classification for this event.</p>
                </div>
                <div className={fieldClass}>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={data.title} onChange={(event) => onChange('title', event.target.value)} required />
                    <FormError message={errors.title} />
                    <p className="text-muted-foreground text-xs">The slug is generated automatically.</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <FilterSelect
                            label="Event type"
                            value={data.event_type || undefined}
                            onChange={(value) => onChange('event_type', value)}
                            placeholder="Select event type"
                            options={eventTypes.map((type) => ({ value: type, label: type }))}
                        />
                        <FormError className="mt-2" message={errors.event_type} />
                    </div>
                    <div>
                        <FilterSelect
                            label="Barangay (optional)"
                            value={data.barangay_id || 'none'}
                            onChange={(value) => onChange('barangay_id', value === 'none' ? '' : value)}
                            options={[
                                { value: 'none', label: 'Municipality-wide / Not specified' },
                                ...barangays.map((barangay) => ({
                                    value: String(barangay.id),
                                    label: `${barangay.name}${barangay.status === 'inactive' ? ' (Inactive)' : ''}`,
                                })),
                            ]}
                        />
                        <FormError className="mt-2" message={errors.barangay_id} />
                    </div>
                </div>
                <div className={fieldClass}>
                    <Label htmlFor="venue">Venue</Label>
                    <Input id="venue" value={data.venue} onChange={(event) => onChange('venue', event.target.value)} required />
                    <FormError message={errors.venue} />
                </div>
                <div className={fieldClass}>
                    <Label htmlFor="short_description">Short description</Label>
                    <textarea
                        id="short_description"
                        rows={3}
                        value={data.short_description}
                        onChange={(event) => onChange('short_description', event.target.value)}
                        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                    />
                    <FormError message={errors.short_description} />
                </div>
                <div className={fieldClass}>
                    <Label htmlFor="description">Full description</Label>
                    <textarea
                        id="description"
                        rows={8}
                        value={data.description}
                        onChange={(event) => onChange('description', event.target.value)}
                        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                    />
                    <FormError message={errors.description} />
                </div>
            </section>

            <section className="grid gap-5 rounded-xl border p-5">
                <div>
                    <h3 className="font-semibold">Schedule</h3>
                    <p className="text-muted-foreground text-sm">Dates are optional until the official schedule is verified.</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className={fieldClass}>
                        <Label htmlFor="start_date">Start date</Label>
                        <Input id="start_date" type="date" value={data.start_date} onChange={(event) => onChange('start_date', event.target.value)} />
                        <FormError message={errors.start_date} />
                    </div>
                    <div className={fieldClass}>
                        <Label htmlFor="end_date">End date</Label>
                        <Input
                            id="end_date"
                            type="date"
                            min={data.start_date || undefined}
                            value={data.end_date}
                            onChange={(event) => onChange('end_date', event.target.value)}
                        />
                        <FormError message={errors.end_date} />
                    </div>
                    <div className={fieldClass}>
                        <Label htmlFor="start_time">Start time</Label>
                        <Input id="start_time" type="time" value={data.start_time} onChange={(event) => onChange('start_time', event.target.value)} />
                        <FormError message={errors.start_time} />
                    </div>
                    <div className={fieldClass}>
                        <Label htmlFor="end_time">End time</Label>
                        <Input id="end_time" type="time" value={data.end_time} onChange={(event) => onChange('end_time', event.target.value)} />
                        <FormError message={errors.end_time} />
                    </div>
                </div>
            </section>

            <section className="grid gap-5 rounded-xl border p-5">
                <h3 className="font-semibold">Organizer and registration</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className={fieldClass}>
                        <Label htmlFor="organizer">Organizer</Label>
                        <Input id="organizer" value={data.organizer} onChange={(event) => onChange('organizer', event.target.value)} />
                        <FormError message={errors.organizer} />
                    </div>
                    <div className={fieldClass}>
                        <Label htmlFor="contact_number">Contact number</Label>
                        <Input id="contact_number" value={data.contact_number} onChange={(event) => onChange('contact_number', event.target.value)} />
                        <FormError message={errors.contact_number} />
                    </div>
                </div>
                <div className={fieldClass}>
                    <Label htmlFor="registration_link">Registration link</Label>
                    <Input
                        id="registration_link"
                        type="url"
                        placeholder="https://"
                        value={data.registration_link}
                        onChange={(event) => onChange('registration_link', event.target.value)}
                    />
                    <FormError message={errors.registration_link} />
                </div>
            </section>

            <section className="grid gap-5 rounded-xl border p-5">
                <h3 className="font-semibold">Image and publishing</h3>
                <div>
                    <Label>Featured image</Label>
                    <ImageUploader
                        files={data.featured_image ? [data.featured_image] : []}
                        multiple={false}
                        maxFiles={1}
                        onChange={(files) => onChange('featured_image', files[0] ?? null)}
                        error={errors.featured_image}
                        className="mt-2"
                    />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <FilterSelect
                            label="Status"
                            value={data.status}
                            onChange={(value) => onChange('status', value)}
                            options={[
                                { value: 'draft', label: 'Draft' },
                                { value: 'published', label: 'Published' },
                                { value: 'archived', label: 'Archived' },
                            ]}
                        />
                        <FormError className="mt-2" message={errors.status} />
                    </div>
                    <label className="flex items-center gap-3 self-end rounded-lg border p-3 text-sm font-medium">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(event) => onChange('is_featured', event.target.checked)}
                            className="size-4"
                        />
                        Feature this event
                    </label>
                </div>
            </section>
        </div>
    );
}
