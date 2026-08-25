import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { type FormEvent, useEffect, useRef } from 'react';

export function SearchInput({
    value,
    onChange,
    onSearch,
    onClear,
    placeholder = 'Search…',
    debounceMs = 400,
    autoSearch = true,
}: {
    value: string;
    onChange: (value: string) => void;
    onSearch: (value?: string) => void;
    onClear: () => void;
    placeholder?: string;
    debounceMs?: number;
    autoSearch?: boolean;
}) {
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!autoSearch) return;
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        const timeout = window.setTimeout(() => onSearch(value), debounceMs);
        return () => window.clearTimeout(timeout);
    }, [autoSearch, debounceMs, onSearch, value]);

    function submit(event: FormEvent): void {
        event.preventDefault();
        onSearch(value);
    }
    return (
        <form onSubmit={submit} className="flex gap-2">
            <div className="relative max-w-md flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                    type="search"
                    aria-label="Search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="pr-9 pl-9"
                />
                {value && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={onClear}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>
            <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                Search
            </Button>
        </form>
    );
}
