import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    branding: {
        logo_url: string | null;
        site_name: string;
        tagline: string;
    } | null;
    partnerWorkspace?: {
        is_local_product_producer: boolean;
        can_report_arrivals: boolean;
    } | null;
    partnerNotifications?: {
        unread_count: number;
        items: {
            id: string;
            data: {
                activity_type: 'reservation' | 'product_order';
                title: string;
                message: string;
                reference: string;
                url: string;
            };
            is_read: boolean;
            created_at: string;
        }[];
    } | null;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role?: { id: number; name: string } | null;
    [key: string]: unknown; // This allows for additional properties...
}
