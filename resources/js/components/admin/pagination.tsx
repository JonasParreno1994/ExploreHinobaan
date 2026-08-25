import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export interface LaravelPaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface LaravelPaginator {
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links?: LaravelPaginationLink[];
}

export function Pagination({
    pagination,
    currentPage: currentPageProp,
    lastPage: lastPageProp,
    previousUrl: previousUrlProp,
    nextUrl: nextUrlProp,
    links,
    preserveScroll = true,
}: {
    pagination?: LaravelPaginator;
    currentPage?: number;
    lastPage?: number;
    previousUrl?: string | null;
    nextUrl?: string | null;
    links?: LaravelPaginationLink[];
    preserveScroll?: boolean;
}) {
    const currentPage = pagination?.current_page ?? currentPageProp ?? 1;
    const lastPage = pagination?.last_page ?? lastPageProp ?? 1;
    const previousUrl = pagination?.prev_page_url ?? previousUrlProp ?? null;
    const nextUrl = pagination?.next_page_url ?? nextUrlProp ?? null;
    const paginationLinks = pagination?.links ?? links;

    if (lastPage <= 1) return null;

    const pageLinks = paginationLinks?.slice(1, -1) ?? [];

    return (
        <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 text-sm">
            <span className="text-muted-foreground">
                Page {currentPage} of {lastPage}
            </span>
            <div className="flex items-center gap-1">
                {previousUrl ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={previousUrl} preserveScroll={preserveScroll}>
                            Previous
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                )}
                <div className="hidden items-center gap-1 sm:flex">
                    {pageLinks.map((link, index) =>
                        link.url ? (
                            <Button
                                key={`${link.label}-${index}`}
                                variant={link.active ? 'default' : 'outline'}
                                size="icon"
                                className="size-9"
                                asChild
                            >
                                <Link href={link.url} preserveScroll={preserveScroll} aria-current={link.active ? 'page' : undefined}>
                                    {link.label}
                                </Link>
                            </Button>
                        ) : (
                            <span key={`${link.label}-${index}`} className="text-muted-foreground px-2">
                                {link.label.replaceAll('&hellip;', '…')}
                            </span>
                        ),
                    )}
                </div>
                {nextUrl ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={nextUrl} preserveScroll={preserveScroll}>
                            Next
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                )}
            </div>
        </nav>
    );
}
