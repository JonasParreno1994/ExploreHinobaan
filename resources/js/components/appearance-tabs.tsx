import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div className={cn('grid w-full grid-cols-1 gap-3 sm:grid-cols-3', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex min-h-24 flex-col items-start justify-between rounded-xl border p-4 text-left transition-colors',
                        appearance === value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500 dark:bg-emerald-950 dark:text-emerald-200'
                            : 'bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-emerald-300',
                    )}
                >
                    <Icon className="size-5" />
                    <span className="text-sm font-medium">{label}</span>
                </button>
            ))}
        </div>
    );
}
