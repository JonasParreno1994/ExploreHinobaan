import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

const defaultAcceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploader({
    files,
    onChange,
    multiple = true,
    maxFiles = 10,
    maxSizeMb = 5,
    acceptedTypes = defaultAcceptedTypes,
    disabled = false,
    error,
    className,
}: {
    files: File[];
    onChange: (files: File[]) => void;
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMb?: number;
    acceptedTypes?: string[];
    disabled?: boolean;
    error?: string;
    className?: string;
}) {
    const inputId = useId();
    const [validationError, setValidationError] = useState<string>();
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviews(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [files]);

    function selectFiles(selectedFiles: File[]): void {
        const validFiles = selectedFiles.filter((file) => acceptedTypes.includes(file.type) && file.size <= maxSizeMb * 1024 * 1024);
        if (validFiles.length !== selectedFiles.length) {
            setValidationError(`Only accepted images up to ${maxSizeMb} MB are allowed.`);
            return;
        }

        const nextFiles = multiple ? [...files, ...validFiles].slice(0, maxFiles) : validFiles.slice(0, 1);
        setValidationError(selectedFiles.length + files.length > maxFiles ? `You may select up to ${maxFiles} images.` : undefined);
        onChange(nextFiles);
    }

    return (
        <div className={cn('grid gap-3', className)}>
            <label
                htmlFor={inputId}
                className={cn(
                    'border-muted-foreground/30 hover:bg-muted/40 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors',
                    disabled && 'pointer-events-none opacity-50',
                )}
            >
                <ImagePlus className="text-emerald-700" />
                <span className="text-sm font-medium">Choose {multiple ? 'images' : 'an image'}</span>
                <span className="text-muted-foreground text-xs">JPG, PNG or WebP · maximum {maxSizeMb} MB each</span>
            </label>
            <Input
                id={inputId}
                type="file"
                className="sr-only"
                multiple={multiple}
                disabled={disabled}
                accept={acceptedTypes.join(',')}
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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {files.map((file, index) => (
                        <div key={`${file.name}-${file.lastModified}-${index}`} className="group relative overflow-hidden rounded-xl border">
                            <img src={previews[index]} alt={`Selected image ${index + 1}`} className="aspect-square w-full object-cover" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                aria-label={`Remove ${file.name}`}
                                disabled={disabled}
                                onClick={() => onChange(files.filter((_, fileIndex) => fileIndex !== index))}
                                className="absolute top-2 right-2 size-8 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                                <Trash2 />
                            </Button>
                            <p className="truncate px-2 py-1.5 text-xs" title={file.name}>
                                {file.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
