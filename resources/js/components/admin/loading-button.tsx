import { Button, type ButtonProps } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

export function LoadingButton({
    loading = false,
    loadingLabel = 'Please wait…',
    disabled,
    children,
    ...props
}: ButtonProps & {
    loading?: boolean;
    loadingLabel?: string;
}) {
    return (
        <Button {...props} disabled={disabled || loading} aria-busy={loading}>
            {loading && <LoaderCircle className="animate-spin" />}
            {loading ? loadingLabel : children}
        </Button>
    );
}
