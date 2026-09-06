import { ImageUploader } from '@/components/admin/image-uploader';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface HeaderSettingFormData {
    name: string;
    site_name: string;
    tagline: string;
    logo: File | null;
    remove_logo: boolean;
    social_image: File | null;
    remove_social_image: boolean;
    webapp_logo: File | null;
    remove_webapp_logo: boolean;
    login_label: string;
    register_label: string;
    status: string;
}

interface HeaderSettingFormProps {
    data: HeaderSettingFormData;
    errors: Partial<Record<keyof HeaderSettingFormData, string>>;
    onChange: <K extends keyof HeaderSettingFormData>(field: K, value: HeaderSettingFormData[K]) => void;
    currentLogoUrl?: string | null;
    currentSocialImageUrl?: string | null;
    currentWebappLogoUrl?: string | null;
}

const textFields: { key: 'name' | 'site_name' | 'tagline' | 'login_label' | 'register_label'; label: string }[] = [
    { key: 'name', label: 'Configuration name' },
    { key: 'site_name', label: 'Website name' },
    { key: 'tagline', label: 'Header tagline' },
    { key: 'login_label', label: 'Enterprise login CTA label' },
    { key: 'register_label', label: 'Header partner button label' },
];

export function HeaderSettingForm({ data, errors, onChange, currentLogoUrl, currentSocialImageUrl, currentWebappLogoUrl }: HeaderSettingFormProps) {
    return (
        <div className="grid gap-6">
            <div className="grid gap-5 md:grid-cols-2">
                {textFields.map(({ key, label }) => (
                    <div key={key} className="grid gap-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Input id={key} value={data[key]} onChange={(event) => onChange(key, event.target.value)} required />
                        <InputError message={errors[key]} />
                    </div>
                ))}
            </div>
            <div className="grid gap-2">
                <Label>Header logo</Label>
                {currentLogoUrl && !data.remove_logo && !data.logo && (
                    <div className="flex items-center gap-4 rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/40">
                        <img src={currentLogoUrl} alt="Current header logo" className="size-20 rounded-xl bg-white object-contain p-2" />
                        <div className="grid gap-2">
                            <p className="text-sm font-medium">Current logo</p>
                            <Button type="button" variant="outline" size="sm" onClick={() => onChange('remove_logo', true)}>
                                Remove logo
                            </Button>
                        </div>
                    </div>
                )}
                <ImageUploader
                    files={data.logo ? [data.logo] : []}
                    onChange={(files) => {
                        onChange('logo', files[0] ?? null);
                        onChange('remove_logo', false);
                    }}
                    multiple={false}
                    maxFiles={1}
                    maxSizeMb={2}
                    error={errors.logo}
                />
                <p className="text-muted-foreground text-xs">Use a square PNG, JPG, or WebP image for the best result.</p>
            </div>
            <div className="grid gap-2 border-t pt-6">
                <Label>Web app logo</Label>
                <p className="text-muted-foreground text-sm">
                    This logo appears on the phone home screen after visitors install the website as an app.
                </p>
                {currentWebappLogoUrl && !data.remove_webapp_logo && !data.webapp_logo && (
                    <div className="flex items-center gap-4 rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/40">
                        <img src={currentWebappLogoUrl} alt="Current web app logo" className="size-24 rounded-2xl bg-white object-contain" />
                        <div className="grid gap-2">
                            <p className="text-sm font-medium">Current web app logo</p>
                            <Button type="button" variant="outline" size="sm" onClick={() => onChange('remove_webapp_logo', true)}>
                                Remove logo
                            </Button>
                        </div>
                    </div>
                )}
                <ImageUploader
                    files={data.webapp_logo ? [data.webapp_logo] : []}
                    onChange={(files) => {
                        onChange('webapp_logo', files[0] ?? null);
                        onChange('remove_webapp_logo', false);
                    }}
                    multiple={false}
                    maxFiles={1}
                    maxSizeMb={2}
                    error={errors.webapp_logo}
                />
                <p className="text-muted-foreground text-xs">Required: square PNG, exactly 512 × 512 pixels, maximum 2 MB.</p>
            </div>
            <div className="grid gap-2 border-t pt-6">
                <Label>Social media preview image</Label>
                <p className="text-muted-foreground text-sm">
                    This image appears when the public website link is shared on Facebook, Messenger, X, LinkedIn, and other supported platforms.
                </p>
                {currentSocialImageUrl && !data.remove_social_image && !data.social_image && (
                    <div className="overflow-hidden rounded-xl border bg-slate-50 dark:bg-slate-900/40">
                        <img src={currentSocialImageUrl} alt="Current social media preview" className="aspect-[1200/630] w-full object-cover" />
                        <div className="flex items-center justify-between gap-4 p-4">
                            <p className="text-sm font-medium">Current social preview</p>
                            <Button type="button" variant="outline" size="sm" onClick={() => onChange('remove_social_image', true)}>
                                Remove image
                            </Button>
                        </div>
                    </div>
                )}
                <ImageUploader
                    files={data.social_image ? [data.social_image] : []}
                    onChange={(files) => {
                        onChange('social_image', files[0] ?? null);
                        onChange('remove_social_image', false);
                    }}
                    multiple={false}
                    maxFiles={1}
                    maxSizeMb={5}
                    error={errors.social_image}
                />
                <p className="text-muted-foreground text-xs">Recommended size: 1200 × 630 pixels. Maximum file size: 5 MB.</p>
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
