import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface FooterSettingFormData {
    name: string;
    description: string;
    municipality: string;
    office: string;
    address: string;
    email: string;
    phone: string;
    facebook_url: string;
    instagram_url: string;
    youtube_url: string;
    copyright_text: string;
    status: string;
}

export function FooterSettingForm({
    data,
    errors,
    onChange,
}: {
    data: FooterSettingFormData;
    errors: Record<string, string | undefined>;
    onChange: <K extends keyof FooterSettingFormData>(field: K, value: FooterSettingFormData[K]) => void;
}) {
    const fields: { key: keyof FooterSettingFormData; label: string; type?: string; placeholder?: string }[] = [
        { key: 'name', label: 'Configuration name', placeholder: 'Main Tourism Footer' },
        { key: 'municipality', label: 'Municipality', placeholder: 'Municipality of Hinoba-an' },
        { key: 'office', label: 'Office', placeholder: 'Municipal Tourism Office' },
        { key: 'address', label: 'Address' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'phone', label: 'Contact number' },
        { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
        { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
        { key: 'youtube_url', label: 'YouTube URL', type: 'url' },
        { key: 'copyright_text', label: 'Copyright text' },
    ];

    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="description">Portal description</Label>
                <textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    className="border-input bg-background focus-visible:ring-ring/50 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                    required
                />
                <InputError message={errors.description} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.key} className={`grid gap-2 ${field.key === 'address' || field.key === 'copyright_text' ? 'md:col-span-2' : ''}`}>
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                            id={field.key}
                            type={field.type}
                            value={data[field.key]}
                            placeholder={field.placeholder}
                            onChange={(event) => onChange(field.key, event.target.value)}
                            required={!field.key.endsWith('_url')}
                        />
                        <InputError message={errors[field.key]} />
                    </div>
                ))}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    value={data.status}
                    onChange={(event) => onChange('status', event.target.value)}
                    className="bg-background h-10 rounded-md border px-3 text-sm"
                >
                    <option value="active">Active — displayed publicly</option>
                    <option value="inactive">Inactive</option>
                </select>
                <InputError message={errors.status} />
            </div>
        </div>
    );
}
