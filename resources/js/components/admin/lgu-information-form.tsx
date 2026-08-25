import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface LguInformationFormData {
    history: string;
    mission: string;
    vision: string;
    area: string;
    number_of_barangays: string;
    location: string;
    images: File[];
}

export function LguInformationForm({
    data,
    errors,
    onChange,
    imagesRequired,
}: {
    data: LguInformationFormData;
    errors: Partial<Record<keyof LguInformationFormData | 'images.0', string>>;
    onChange: <K extends keyof LguInformationFormData>(field: K, value: LguInformationFormData[K]) => void;
    imagesRequired: boolean;
}) {
    const textareaClass =
        'border-input bg-background min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden';
    return (
        <div className="grid gap-5">
            <div className="grid gap-2">
                <Label htmlFor="history">History</Label>
                <textarea
                    id="history"
                    className={textareaClass}
                    value={data.history}
                    onChange={(e) => onChange('history', e.target.value)}
                    required
                />
                <InputError message={errors.history} />
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="mission">Mission</Label>
                    <textarea
                        id="mission"
                        className={textareaClass}
                        value={data.mission}
                        onChange={(e) => onChange('mission', e.target.value)}
                        required
                    />
                    <InputError message={errors.mission} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="vision">Vision</Label>
                    <textarea
                        id="vision"
                        className={textareaClass}
                        value={data.vision}
                        onChange={(e) => onChange('vision', e.target.value)}
                        required
                    />
                    <InputError message={errors.vision} />
                </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor="area">Area (km²)</Label>
                    <Input
                        id="area"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.area}
                        onChange={(e) => onChange('area', e.target.value)}
                        required
                    />
                    <InputError message={errors.area} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="number_of_barangays">Number of barangays</Label>
                    <Input
                        id="number_of_barangays"
                        type="number"
                        min="1"
                        value={data.number_of_barangays}
                        onChange={(e) => onChange('number_of_barangays', e.target.value)}
                        required
                    />
                    <InputError message={errors.number_of_barangays} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={data.location} onChange={(e) => onChange('location', e.target.value)} required />
                    <InputError message={errors.location} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="images">Images {imagesRequired ? '(minimum 5)' : '(optional additional images)'}</Label>
                <Input
                    id="images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    required={imagesRequired}
                    onChange={(e) => onChange('images', Array.from(e.target.files ?? []))}
                />
                <p className="text-muted-foreground text-xs">Selected: {data.images.length}. JPG, PNG, or WebP; maximum 5 MB each.</p>
                <InputError message={errors.images ?? errors['images.0']} />
                {data.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {data.images.map((image, index) => (
                            <img
                                key={`${image.name}-${index}`}
                                src={URL.createObjectURL(image)}
                                alt={`Selected preview ${index + 1}`}
                                className="aspect-square w-full rounded-lg object-cover"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
