import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export function BackToLanding({ compact = false }: { compact?: boolean }) {
    return (
        <Link
            href={route('home')}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#0F766E] px-3 py-2 text-sm font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white sm:px-4"
        >
            <ArrowLeft className="size-4" />
            <span className={compact ? 'hidden sm:inline' : ''}>Back to Landing Page</span>
        </Link>
    );
}
