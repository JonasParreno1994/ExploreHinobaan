import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Trash2 } from 'lucide-react';

export function DeleteDialog({
    open,
    onOpenChange,
    title = 'Delete record?',
    description,
    confirmLabel = 'Delete',
    processing = false,
    onDelete,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description: string;
    confirmLabel?: string;
    processing?: boolean;
    onDelete: () => void;
}) {
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            confirmLabel={confirmLabel}
            confirmVariant="destructive"
            processing={processing}
            icon={<Trash2 className="size-5 text-red-600" />}
            onConfirm={onDelete}
        />
    );
}
