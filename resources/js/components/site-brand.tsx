import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Waves } from 'lucide-react';

export function SiteLogo({ className = 'size-12' }: { className?: string }) {
    const { branding } = usePage<SharedData>().props;
    const siteName = branding?.site_name || 'Explore Hinoba-an';

    return branding?.logo_url ? (
        <span
            className={`${className} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-sm ring-1 ring-orange-100`}
        >
            <img src={branding.logo_url} alt={`${siteName} logo`} className="size-full object-contain" />
        </span>
    ) : (
        <span className={`${className} flex shrink-0 items-center justify-center rounded-2xl bg-[#F97316] text-white`}>
            <Waves className="size-1/2" />
        </span>
    );
}

export function SiteBrand({ subtitle, compact = false }: { subtitle?: string; compact?: boolean }) {
    const { branding } = usePage<SharedData>().props;
    const siteName = branding?.site_name || 'Explore Hinoba-an';
    const tagline = subtitle || branding?.tagline || 'Tourism Portal';

    return (
        <span className="flex min-w-0 items-center gap-3">
            <SiteLogo className={compact ? 'size-10' : 'size-12'} />
            <span className="min-w-0 leading-tight">
                <strong className="block truncate text-sm font-bold text-[#1F2937] sm:text-base">{siteName}</strong>
                <small className="block truncate text-[10px] font-semibold tracking-[.12em] text-[#0F766E] uppercase">{tagline}</small>
            </span>
        </span>
    );
}
