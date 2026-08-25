import { FilterSelect } from '@/components/admin/filter-select';
import { FormError } from '@/components/admin/form-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface TourismCategoryFormData extends Record<string, string> {
    name: string;
    description: string;
    icon: string;
    status: string;
}

const iconOptions = ['Mountain', 'Waves', 'Palmtree', 'Droplets', 'Trees', 'Hotel', 'Bed', 'Utensils', 'Activity', 'CalendarDays', 'ShoppingBag'].map(
    (icon) => ({ value: icon, label: icon }),
);

export function TourismCategoryForm({
    data,
    errors,
    onChange,
}: {
    data: TourismCategoryFormData;
    errors: Partial<Record<keyof TourismCategoryFormData, string>>;
    onChange: (field: keyof TourismCategoryFormData, value: string) => void;
}) {
    return (
        <div className="grid gap-5">
            <div className="grid gap-2">
                <Label htmlFor="name">Category name</Label>
                <Input id="name" value={data.name} onChange={(event) => onChange('name', event.target.value)} required />
                <FormError message={errors.name} />
                <p className="text-muted-foreground text-xs">The slug is generated automatically.</p>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                />
                <FormError message={errors.description} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <FilterSelect
                        label="Lucide icon"
                        value={data.icon || undefined}
                        onChange={(value) => onChange('icon', value)}
                        placeholder="Select an icon"
                        options={iconOptions}
                    />
                    <FormError message={errors.icon} className="mt-2" />
                </div>
                <div>
                    <FilterSelect
                        label="Status"
                        value={data.status}
                        onChange={(value) => onChange('status', value)}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                        ]}
                    />
                    <FormError message={errors.status} className="mt-2" />
                </div>
            </div>
        </div>
    );
}
