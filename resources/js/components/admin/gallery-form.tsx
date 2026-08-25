import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface GalleryFormData {
    images: File[];
    status: string;
}

export function GalleryForm({
    data,
    errors,
    onChange,
    imagesRequired,
}: {
    data: GalleryFormData;
    errors: Record<string, string | undefined>;
    onChange: <K extends keyof GalleryFormData>(field: K, value: GalleryFormData[K]) => void;
    imagesRequired: boolean;
}) {
    return (
        <div className="grid gap-6">
            <section className="grid gap-4 rounded-xl border p-5">
                <div>
                    <h3 className="font-semibold">Gallery pictures</h3>
                    <p className="text-muted-foreground text-sm">Select up to 30 JPG, PNG, or WebP images, up to 5 MB each.</p>
                </div>
                <Input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    required={imagesRequired}
                    onChange={(event) => onChange('images', Array.from(event.target.files ?? []))}
                />
                <InputError message={errors.images ?? errors['images.0']} />
                {data.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {data.images.map((image, index) => (
                            <img
                                key={`${image.name}-${index}`}
                                src={URL.createObjectURL(image)}
                                alt={`Selected gallery picture ${index + 1}`}
                                className="aspect-square w-full rounded-xl object-cover"
                            />
                        ))}
                    </div>
                )}
            </section>
            <section className="grid gap-2 rounded-xl border p-5">
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
            </section>
        </div>
    );
}
