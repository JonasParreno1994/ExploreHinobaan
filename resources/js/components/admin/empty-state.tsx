import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Inbox } from 'lucide-react';
import { type ReactNode } from 'react';

export function EmptyState({
    title = 'No records found',
    description,
    icon,
    actionLabel,
    actionHref,
    action,
    className,
}: {
    title?: string;
    description?: string;
    icon?: ReactNode;
    actionLabel?: string;
    actionHref?: string;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-4 px-6 py-16 text-center', className)}>
            <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
                {icon ?? <Inbox className="size-6" />}
            </div>
            <div className="grid max-w-md gap-1">
                <h3 className="font-semibold">{title}</h3>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            {action ??
                (actionLabel && actionHref ? (
                    <Button asChild>
                        <Link href={actionHref}>{actionLabel}</Link>
                    </Button>
                ) : null)}
        </div>
    );
}
