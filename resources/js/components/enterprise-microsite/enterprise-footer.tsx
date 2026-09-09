import { EnterpriseMicrositeData } from '@/components/enterprise-microsite/types';
import { SiteBrand } from '@/components/site-brand';
import { BadgeCheck, Mail, MapPin, Phone } from 'lucide-react';

export function EnterpriseFooter({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    const logo = enterprise.microsite?.logo_url ?? enterprise.logo_url;
    return (
        <footer className="mt-24 bg-slate-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_.9fr_.8fr]">
                {' '}
                <div>
                    {logo ? (
                        <img src={logo} alt={`${enterprise.business_name} logo`} className="size-16 rounded-2xl bg-white object-cover" />
                    ) : (
                        <SiteBrand compact />
                    )}
                    <h2 className="mt-4 text-xl font-black">{enterprise.business_name}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/60">{enterprise.microsite?.tagline || enterprise.enterprise_type.name}</p>
                </div>
                <div>
                    <h3 className="font-black">Contact & Location</h3>
                    <div className="mt-4 grid gap-3 text-sm text-white/65">
                        <p className="flex gap-2">
                            <MapPin className="size-4 shrink-0" /> {enterprise.address}
                        </p>
                        {enterprise.phone && (
                            <a href={`tel:${enterprise.phone}`} className="flex gap-2">
                                <Phone className="size-4" /> {enterprise.phone}
                            </a>
                        )}
                        {enterprise.email && (
                            <a href={`mailto:${enterprise.email}`} className="flex gap-2">
                                <Mail className="size-4" /> {enterprise.email}
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="font-black">Follow</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {enterprise.social_links.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold capitalize"
                            >
                                {link.platform}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center text-xs text-white/55 sm:px-8 md:flex-row md:text-left">
                    <span className="inline-flex items-center gap-2 font-bold text-white/75">
                        <BadgeCheck className="size-4 text-emerald-400" /> Listed and Verified through Explore Hinoba-an – Municipal Tourism Office of
                        Hinoba-an
                    </span>
                    <a href={route('home')} className="font-bold text-white">
                        Explore more of Hinoba-an
                    </a>
                </div>
            </div>
        </footer>
    );
}
