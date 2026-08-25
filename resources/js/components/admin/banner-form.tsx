import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface BannerFormData {
    images: File[];
    status: string;
}
export function BannerForm({
    data,
    errors,
    onChange,
    imagesRequired,
}: {
    data: BannerFormData;
    errors: Record<string, string | undefined>;
    onChange: <K extends keyof BannerFormData>(field: K, value: BannerFormData[K]) => void;
    imagesRequired: boolean;
}) {
    return (
        <div className="grid gap-6">
            <section className="grid gap-4 rounded-xl border p-5">
                <h3 className="font-semibold">Banner status</h3>
                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => onChange('status', e.target.value)}
                        className="bg-background flex h-10 rounded-md border px-3 text-sm"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </section>
            <section className="grid gap-4 rounded-xl border p-5">
                <div>
                    <h3 className="font-semibold">Pictures</h3>
                    <p className="text-muted-foreground text-sm">Each picture becomes one slide in the landing-page carousel.</p>
                </div>
                <Input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    required={imagesRequired}
                    onChange={(e) => onChange('images', Array.from(e.target.files ?? []))}
                />
                <InputError message={errors.images ?? errors['images.0']} />
                {data.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {data.images.map((image, i) => (
                            <img
                                key={`${image.name}-${i}`}
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${i + 1}`}
                                className="aspect-video w-full rounded-lg object-cover"
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
