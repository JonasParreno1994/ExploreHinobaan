import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FilterOption {
    value: string;
    label: string;
}

export function FilterSelect({
    value,
    onChange,
    options,
    placeholder = 'Select filter',
    label,
    className,
}: {
    value?: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
    label?: string;
    className?: string;
}) {
    return (
        <div className="grid gap-2">
            {label && <Label>{label}</Label>}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className={className}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
