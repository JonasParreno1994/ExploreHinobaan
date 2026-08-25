import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export function StatCard({
    title,
    value,
    description,
    icon,
    trend,
    className,
}: {
    title: string;
    value: ReactNode;
    description?: string;
    icon?: ReactNode;
    trend?: ReactNode;
    className?: string;
}) {
    return (
        <Card className={className}>
            <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="grid gap-1">
                    <p className="text-muted-foreground text-sm font-medium">{title}</p>
                    <div className="text-2xl font-bold tracking-tight">{value}</div>
                    {description && <p className="text-muted-foreground text-xs">{description}</p>}
                    {trend && <div className="text-xs">{trend}</div>}
                </div>
                {icon && (
                    <div
                        className={cn(
                            'flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
                        )}
                    >
                        {icon}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
