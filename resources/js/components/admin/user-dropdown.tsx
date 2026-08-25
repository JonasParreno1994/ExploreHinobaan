import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronDown, KeyRound, LogOut, UserRound } from 'lucide-react';

export function UserDropdown({ user }: { user: User }) {
    const getInitials = useInitials();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 gap-2 rounded-xl px-2">
                    <Avatar className="size-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-emerald-700 text-xs text-white">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-36 text-left sm:grid">
                        <span className="truncate text-sm font-semibold">{user.name}</span>
                        <span className="text-muted-foreground truncate text-xs font-normal">{user.email}</span>
                    </span>
                    <ChevronDown className="text-muted-foreground hidden size-4 sm:block" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={route('profile.edit')} prefetch>
                            <UserRound />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={route('password.edit')} prefetch>
                            <KeyRound />
                            Change Password
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={route('logout')} method="post" as="button" className="w-full text-red-600 focus:text-red-600">
                        <LogOut />
                        Logout
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
