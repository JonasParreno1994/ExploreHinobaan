import { FilterSelect } from '@/components/admin/filter-select';
import { FormError } from '@/components/admin/form-error';
import { ImageUploader } from '@/components/admin/image-uploader';
import { LocationPicker } from '@/components/map/location-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface DestinationFormData {
    [key: string]: string | boolean | File | File[] | null;
    category_id: string;
    barangay_id: string;
    name: string;
    short_description: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    entrance_fee: string;
    opening_time: string;
    closing_time: string;
    contact_number: string;
    email: string;
    website: string;
    featured_image: File | null;
    gallery_images: File[];
    status: string;
    is_featured: boolean;
}

export interface DestinationOption {
    id: number;
    name: string;
    status: string;
}

export function DestinationForm({
    data,
    errors,
    categories,
    barangays,
    onChange,
}: {
    data: DestinationFormData;
    errors: Record<string, string | undefined>;
    categories: DestinationOption[];
    barangays: DestinationOption[];
    onChange: <K extends keyof DestinationFormData>(field: K, value: DestinationFormData[K]) => void;
}) {
    const fieldClass = 'grid gap-2';
    return (
        <div className="grid gap-6">
            <section className="grid gap-5 rounded-xl border p-5">
                <h3 className="font-semibold">Basic information</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <FilterSelect
                            label="Category"
                            value={data.category_id || undefined}
                            onChange={(value) => onChange('category_id', value)}
                            placeholder="Select category"
                            options={categories.map((item) => ({
                                value: String(item.id),
                                label: `${item.name}${item.status === 'inactive' ? ' (Inactive)' : ''}`,
                            }))}
                        />
                        <FormError className="mt-2" message={errors.category_id} />
                    </div>
                    <div>
                        <FilterSelect
                            label="Barangay"
                            value={data.barangay_id || undefined}
                            onChange={(value) => onChange('barangay_id', value)}
                            placeholder="Select barangay"
                            options={barangays.map((item) => ({
                                value: String(item.id),
                                label: `${item.name}${item.status === 'inactive' ? ' (Inactive)' : ''}`,
                            }))}
                        />
                        <FormError className="mt-2" message={errors.barangay_id} />
                    </div>
                </div>
                <div className={fieldClass}>
                    <Label htmlFor="name">Destination name</Label>
                    <Input id="name" value={data.name} onChange={(event) => onChange('name', event.target.value)} required />
                    <FormError message={errors.name} />
                    <p className="text-muted-foreground text-xs">The slug is generated automatically.</p>
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
                <div className={fieldClass}>
                    <Label htmlFor="address">Address</Label>
                    <textarea
                        id="address"
                        rows={3}
                        value={data.address}
                        onChange={(event) => onChange('address', event.target.value)}
                        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                        required
                    />
                    <FormError message={errors.address} />
                </div>
            </section>
            <section className="grid gap-5 rounded-xl border p-5">
                <div>
                    <h3 className="font-semibold">Location and visitor details</h3>
                    <p className="text-muted-foreground text-sm">Leave coordinates blank until verified by an administrator.</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className={fieldClass}>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                            id="latitude"
                            type="number"
                            step="0.0000001"
                            value={data.latitude}
                            onChange={(e) => onChange('latitude', e.target.value)}
                        />
                        <FormError message={errors.latitude} />
                    </div>
                    <div className={fieldClass}>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                            id="longitude"
                            type="number"
                            step="0.0000001"
                            value={data.longitude}
                            onChange={(e) => onChange('longitude', e.target.value)}
                        />
                        <FormError message={errors.longitude} />
                    </div>
                </div>
                <LocationPicker
                    latitude={data.latitude}
                    longitude={data.longitude}
                    onChange={(latitude, longitude) => {
                        onChange('latitude', latitude);
                        onChange('longitude', longitude);
                    }}
                />
                <div className="grid gap-5 sm:grid-cols-3">
                    <div className={fieldClass}>
                        <Label htmlFor="entrance_fee">Entrance fee</Label>
                        <Input
                            id="entrance_fee"
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.entrance_fee}
                            onChange={(e) => onChange('entrance_fee', e.target.value)}
                        />
                        <FormError message={errors.entrance_fee} />
                    </div>
                    <div className={fieldClass}>
                        <Label htmlFor="opening_time">Opening time</Label>
                        <Input id="opening_time" type="time" value={data.opening_time} onChange={(e) => onChange('opening_time', e.target.value)} />
                        <FormError message={errors.opening_time} />
                    </div>
                    <div className={fieldClass}>
                        <Label htmlFor="closing_time">Closing time</Label>
                        <Input id="closing_time" type="time" value={data.closing_time} onChange={(e) => onChange('closing_time', e.target.value)} />
                        <FormError message={errors.closing_time} />
                    </div>
                </div>
            </section>
            <section className="grid gap-5 rounded-xl border p-5">
                <h3 className="font-semibold">Contact information</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className={fieldClass}>
                        <Label htmlFor="contact_number">Contact number</Label>
                        <Input id="contact_number" value={data.contact_number} onChange={(e) => onChange('contact_number', e.target.value)} />
                        <FormError message={errors.contact_number} />
                    </div>
                    <div className={fieldClass}>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => onChange('email', e.target.value)} />
                        <FormError message={errors.email} />
                    </div>
                </div>
                <div className={fieldClass}>
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        type="url"
                        placeholder="https://"
                        value={data.website}
                        onChange={(e) => onChange('website', e.target.value)}
                    />
                    <FormError message={errors.website} />
                </div>
            </section>
            <section className="grid gap-5 rounded-xl border p-5">
                <h3 className="font-semibold">Images</h3>
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
                <div>
                    <Label>Gallery images</Label>
                    <ImageUploader
                        files={data.gallery_images}
                        multiple
                        maxFiles={20}
                        onChange={(files) => onChange('gallery_images', files)}
                        error={errors.gallery_images ?? errors['gallery_images.0']}
                        className="mt-2"
                    />
                </div>
            </section>
            <section className="grid gap-5 rounded-xl border p-5">
                <h3 className="font-semibold">Publishing</h3>
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
                            onChange={(e) => onChange('is_featured', e.target.checked)}
                            className="size-4"
                        />
                        Feature this destination
                    </label>
                </div>
            </section>
        </div>
    );
}
