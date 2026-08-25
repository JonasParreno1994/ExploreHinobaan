import InputError from '@/components/input-error';

export function FormError({ message, className }: { message?: string; className?: string }) {
    return <InputError message={message} className={className} />;
}
