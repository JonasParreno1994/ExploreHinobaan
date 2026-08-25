import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface BarangayFormData {
    psgc_code: string;
    name: string;
    classification: string;
    population: string;
    status: string;
}

export function BarangayForm({
    data,
    errors,
    onChange,
}: {
    data: BarangayFormData;
    errors: Partial<Record<keyof BarangayFormData, string>>;
    onChange: (field: keyof BarangayFormData, value: string) => void;
}) {
    const selectClass =
        'border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden';
    return (
        <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="psgc_code">PSGC code</Label>
                    <Input id="psgc_code" value={data.psgc_code} onChange={(e) => onChange('psgc_code', e.target.value)} maxLength={10} required />
                    <InputError message={errors.psgc_code} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Barangay name</Label>
                    <Input id="name" value={data.name} onChange={(e) => onChange('name', e.target.value)} required />
                    <InputError message={errors.name} />
                </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="classification">Classification</Label>
                    <select
                        id="classification"
                        className={selectClass}
                        value={data.classification}
                        onChange={(e) => onChange('classification', e.target.value)}
                    >
                        <option value="urban">Urban</option>
                        <option value="rural">Rural</option>
                    </select>
                    <InputError message={errors.classification} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="population">Population</Label>
                    <Input id="population" type="number" min="0" value={data.population} onChange={(e) => onChange('population', e.target.value)} />
                    <InputError message={errors.population} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" className={selectClass} value={data.status} onChange={(e) => onChange('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <InputError message={errors.status} />
            </div>
        </div>
    );
}
