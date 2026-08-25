import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface UserFormData {
    name: string;
    email: string;
    phone: string;
    role_id: string;
    status: string;
    password: string;
    password_confirmation: string;
}

export interface RoleOption {
    id: number;
    name: string;
}

interface UserFormFieldsProps {
    data: UserFormData;
    errors: Partial<Record<keyof UserFormData, string>>;
    onChange: (field: keyof UserFormData, value: string) => void;
    passwordRequired?: boolean;
    roles: RoleOption[];
}

export function UserFormFields({ data, errors, onChange, roles, passwordRequired = false }: UserFormFieldsProps) {
    return (
        <div className="grid gap-5">
            <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={data.name} onChange={(event) => onChange('name', event.target.value)} required autoFocus />
                <InputError message={errors.name} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={data.email} onChange={(event) => onChange('email', event.target.value)} required />
                <InputError message={errors.email} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(event) => onChange('phone', event.target.value)}
                        placeholder="e.g. +63 912 345 6789"
                    />
                    <InputError message={errors.phone} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role_id">Role</Label>
                    <select
                        id="role_id"
                        value={data.role_id}
                        onChange={(event) => onChange('role_id', event.target.value)}
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
                    >
                        <option value="">No role assigned</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.role_id} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="status">Account status</Label>
                <select
                    id="status"
                    value={data.status}
                    onChange={(event) => onChange('status', event.target.value)}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
                <InputError message={errors.status} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="password">Password {passwordRequired ? '' : '(optional)'}</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(event) => onChange('password', event.target.value)}
                        required={passwordRequired}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirm password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(event) => onChange('password_confirmation', event.target.value)}
                        required={passwordRequired || data.password.length > 0}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>
            </div>
        </div>
    );
}
