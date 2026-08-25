import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface AnnouncementFormData {
    title: string;
    content: string;
    publish_date: string;
    expiration_date: string;
    status: string;
}

export function AnnouncementForm({
    data,
    errors,
    onChange,
}: {
    data: AnnouncementFormData;
    errors: Record<string, string | undefined>;
    onChange: <K extends keyof AnnouncementFormData>(field: K, value: AnnouncementFormData[K]) => void;
}) {
    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={data.title} onChange={(event) => onChange('title', event.target.value)} required />
                <InputError message={errors.title} />
                <p className="text-muted-foreground text-xs">The slug is generated automatically from the title.</p>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                    id="content"
                    value={data.content}
                    onChange={(event) => onChange('content', event.target.value)}
                    required
                    rows={12}
                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-48 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                />
                <InputError message={errors.content} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="publish_date">Publish date</Label>
                    <Input
                        id="publish_date"
                        type="date"
                        value={data.publish_date}
                        onChange={(event) => onChange('publish_date', event.target.value)}
                        required
                    />
                    <InputError message={errors.publish_date} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="expiration_date">Expiration date</Label>
                    <Input
                        id="expiration_date"
                        type="date"
                        min={data.publish_date}
                        value={data.expiration_date}
                        onChange={(event) => onChange('expiration_date', event.target.value)}
                    />
                    <InputError message={errors.expiration_date} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    value={data.status}
                    onChange={(event) => onChange('status', event.target.value)}
                    className="bg-background flex h-10 rounded-md border px-3 text-sm"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <InputError message={errors.status} />
            </div>
        </div>
    );
}
