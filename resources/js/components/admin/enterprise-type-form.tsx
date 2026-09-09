import { FilterSelect } from '@/components/admin/filter-select';
import { FormError } from '@/components/admin/form-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface EnterpriseTypeFormData {
    name: string;
    description: string;
    status: string;
    website_modules: string[];
}

export type WebsiteModuleOption = { key: string; label: string; destination: string };

export function EnterpriseTypeForm({
    data,
    errors,
    onChange,
    websiteModules,
}: {
    data: EnterpriseTypeFormData;
    errors: Record<string, string | undefined>;
    onChange: <K extends keyof EnterpriseTypeFormData>(field: K, value: EnterpriseTypeFormData[K]) => void;
    websiteModules: WebsiteModuleOption[];
}) {
    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(event) => onChange('name', event.target.value)} required />
                <FormError message={errors.name} />
                <p className="text-muted-foreground text-xs">The slug is generated automatically from the name.</p>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                />
                <FormError message={errors.description} />
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
                <FormError className="mt-2" message={errors.status} />
            </div>
            <fieldset className="grid gap-3 rounded-xl border p-4">
                <legend className="px-2 text-sm font-semibold">Enabled Website Modules</legend>
                <p className="text-muted-foreground text-xs">Select the CMS tools available to enterprises of this type.</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {websiteModules.map((module) => (
                        <label key={module.key} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                            <input
                                type="checkbox"
                                checked={data.website_modules.includes(module.key)}
                                onChange={(event) => onChange('website_modules', event.target.checked
                                    ? [...data.website_modules, module.key]
                                    : data.website_modules.filter((key) => key !== module.key))}
                            />
                            <span>{module.label}</span>
                        </label>
                    ))}
                </div>
                <FormError message={errors.website_modules} />
            </fieldset>
        </div>
    );
}
