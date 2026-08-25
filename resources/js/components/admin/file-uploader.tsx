import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { File, Paperclip, X } from 'lucide-react';
import { useId, useState } from 'react';

export function FileUploader({
    files,
    onChange,
    multiple = true,
    maxFiles = 10,
    maxSizeMb = 10,
    accept,
    disabled = false,
    error,
    className,
}: {
    files: File[];
    onChange: (files: File[]) => void;
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMb?: number;
    accept?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
}) {
    const inputId = useId();
    const [validationError, setValidationError] = useState<string>();

    function selectFiles(selectedFiles: File[]): void {
        if (selectedFiles.some((file) => file.size > maxSizeMb * 1024 * 1024)) {
            setValidationError(`Each file must be ${maxSizeMb} MB or smaller.`);
            return;
        }
        const nextFiles = multiple ? [...files, ...selectedFiles].slice(0, maxFiles) : selectedFiles.slice(0, 1);
        setValidationError(selectedFiles.length + files.length > maxFiles ? `You may select up to ${maxFiles} files.` : undefined);
        onChange(nextFiles);
    }

    return (
        <div className={cn('grid gap-3', className)}>
            <label
                htmlFor={inputId}
                className={cn(
                    'border-muted-foreground/30 hover:bg-muted/40 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-sm font-medium transition-colors',
                    disabled && 'pointer-events-none opacity-50',
                )}
            >
                <Paperclip className="text-emerald-700" />
                Choose {multiple ? 'files' : 'a file'}
            </label>
            <Input
                id={inputId}
                type="file"
                className="sr-only"
                multiple={multiple}
                accept={accept}
                disabled={disabled}
                onChange={(event) => {
                    selectFiles(Array.from(event.target.files ?? []));
                    event.target.value = '';
                }}
            />
            {(error || validationError) && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                    {error ?? validationError}
                </p>
            )}
            {files.length > 0 && (
                <ul className="grid gap-2">
                    {files.map((file, index) => (
                        <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 rounded-lg border p-3">
                            <File className="text-muted-foreground size-5" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{file.name}</p>
                                <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Remove ${file.name}`}
                                disabled={disabled}
                                onClick={() => onChange(files.filter((_, fileIndex) => fileIndex !== index))}
                            >
                                <X />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
