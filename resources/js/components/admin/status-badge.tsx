import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type AdminStatus =
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'published'
    | 'draft'
    | 'archived'
    | 'completed'
    | 'cancelled';

const statusClasses: Record<AdminStatus, string> = {
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    published: 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200',
    completed: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
    pending: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
    draft: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
    inactive: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
    archived: 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
    suspended: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200',
    rejected: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
    cancelled: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
};

export function StatusBadge({ status, className }: { status: AdminStatus; className?: string }) {
    return (
        <Badge variant="outline" className={cn(statusClasses[status], className)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}
