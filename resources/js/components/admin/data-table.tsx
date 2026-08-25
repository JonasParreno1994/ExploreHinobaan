import { cn } from '@/lib/utils';
import { type Key, type ReactNode } from 'react';

export interface DataTableColumn<T> {
    header: string;
    cell: (row: T) => ReactNode;
    className?: string;
    headerClassName?: string;
}

export function DataTable<T>({
    columns,
    rows,
    emptyMessage = 'No records found.',
    emptyState,
    actions,
    getRowKey,
    rowClassName,
}: {
    columns: DataTableColumn<T>[];
    rows: T[];
    emptyMessage?: string;
    emptyState?: ReactNode;
    actions?: (row: T) => ReactNode;
    getRowKey?: (row: T) => Key;
    rowClassName?: (row: T) => string | undefined;
}) {
    if (!rows.length) {
        return emptyState ?? <div className="text-muted-foreground px-6 py-16 text-center text-sm">{emptyMessage}</div>;
    }

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-50/70 text-xs tracking-wide text-emerald-950/60 uppercase dark:bg-emerald-950/20 dark:text-emerald-100/60">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.header}
                                scope="col"
                                className={cn('px-5 py-3 font-semibold whitespace-nowrap', column.headerClassName, column.className)}
                            >
                                {column.header}
                            </th>
                        ))}
                        {actions && (
                            <th scope="col" className="px-5 py-3 text-right font-semibold">
                                <span className="sr-only">Actions</span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/10">
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={getRowKey ? getRowKey(row) : ((row as { id?: Key }).id ?? rowIndex)}
                            className={cn('hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10', rowClassName?.(row))}
                        >
                            {columns.map((column) => (
                                <td key={column.header} data-label={column.header} className={cn('px-5 py-4 align-middle', column.className)}>
                                    {column.cell(row)}
                                </td>
                            ))}
                            {actions && <td className="px-5 py-4 text-right whitespace-nowrap">{actions(row)}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
