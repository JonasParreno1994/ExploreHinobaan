import { SiteBrand } from '@/components/site-brand';
import { PartnerNotificationDropdown } from '@/components/tourism-enterprise/partner-notification-dropdown';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    CalendarCheck2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    DollarSign,
    FileCheck2,
    FileText,
    LayoutDashboard,
    LogOut,
    MapPin,
    Package,
    ShieldCheck,
    ShoppingBag,
    Users,
} from 'lucide-react';

interface Enterprise {
    id: number;
    business_name: string;
    application_status: string;
    address: string;
    description: string | null;
    rejection_reason: string | null;
    logo_url: string | null;
    cover_image_url: string | null;
    documents_count: number;
    verified_documents_count: number;
    enterprise_type: { name: string } | null;
    barangay: { name: string } | null;
}

interface Statistics {
    enterprises: number;
    approved: number;
    pending: number;
    documents: number;
    reservations: number;
    pending_reservations: number;
    confirmed_reservations: number;
    completed_reservations: number;
    accommodated_guests: number;
    confirmed_revenue: number;
}

interface RecentReservation {
    id: number;
    reservation_number: string;
    customer_name: string;
    total_amount: string;
    status: string;
    enterprise: { business_name: string };
    items: { service: { name: string } }[];
}

interface ProductStatistics {
    products: number;
    published_products: number;
    orders: number;
    pending_orders: number;
    completed_orders: number;
    sales_revenue: number;
}

interface RecentProductOrder {
    id: number;
    order_number: string;
    customer_name: string;
    total_amount: string;
    status: string;
    enterprise: { business_name: string };
    items: { product_name: string; quantity: number }[];
}

const statusStyles: Record<string, string> = {
    approved: 'bg-teal-50 text-[#0F766E] ring-teal-200',
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    rejected: 'bg-red-50 text-red-700 ring-red-200',
    suspended: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export default function PartnerDashboard({
    enterprises,
    statistics,
    reservationTrend,
    recentReservations,
    isLocalProductProducer,
    productStatistics,
    productOrderTrend,
    recentProductOrders,
}: {
    enterprises: Enterprise[];
    statistics: Statistics;
    reservationTrend: { label: string; value: number }[];
    recentReservations: RecentReservation[];
    isLocalProductProducer: boolean;
    productStatistics: ProductStatistics;
    productOrderTrend: { label: string; value: number }[];
    recentProductOrders: RecentProductOrder[];
}) {
    const { auth, partnerWorkspace } = usePage<SharedData>().props;
    const activityTrend = isLocalProductProducer ? productOrderTrend : reservationTrend;
    const activityCards = isLocalProductProducer
        ? [
              [productStatistics.products, 'Total products', Package, 'text-[#F97316]', 'bg-orange-50'],
              [productStatistics.pending_orders, 'Pending orders', Clock3, 'text-amber-600', 'bg-amber-50'],
              [productStatistics.completed_orders, 'Completed orders', ShoppingBag, 'text-[#0F766E]', 'bg-teal-50'],
              [`₱${productStatistics.sales_revenue.toLocaleString('en-PH')}`, 'Sales revenue', DollarSign, 'text-sky-700', 'bg-sky-50'],
          ]
        : [
              [statistics.reservations, 'Total reservations', CalendarDays, 'text-[#F97316]', 'bg-orange-50'],
              [statistics.pending_reservations, 'Pending requests', Clock3, 'text-amber-600', 'bg-amber-50'],
              [statistics.accommodated_guests, 'Guests accommodated', Users, 'text-[#0F766E]', 'bg-teal-50'],
              [`₱${statistics.confirmed_revenue.toLocaleString('en-PH')}`, 'Confirmed revenue', DollarSign, 'text-sky-700', 'bg-sky-50'],
          ];

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title="Tourism Enterprise Dashboard" />

            <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
                    <Link href={route('partner.dashboard')} className="flex items-center gap-3">
                        <SiteBrand subtitle="Enterprise Partner Portal" compact />
                    </Link>
                    <div className="flex items-center gap-2">
                        <PartnerNotificationDropdown />
                        <span className="hidden text-right sm:block">
                            <strong className="block text-sm">{auth.user.name}</strong>
                            <small className="text-[#64748B]">{isLocalProductProducer ? 'Local Product Producer' : 'Tourism Enterprise'}</small>
                        </span>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('logout')} method="post" as="button">
                                <LogOut /> <span className="hidden sm:inline">Logout</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[240px_1fr] lg:py-10">
                <aside className="hidden lg:block">
                    <div className="sticky top-28 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
                        <p className="px-3 pb-3 text-[10px] font-bold tracking-[.18em] text-[#64748B] uppercase">Partner workspace</p>
                        <div className="flex items-center gap-3 rounded-2xl bg-[#0F766E] px-4 py-3 font-bold text-white">
                            <LayoutDashboard className="size-5" /> Dashboard
                        </div>
                        <Link
                            href={route('partner.enterprises.index')}
                            className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                        >
                            <Building2 className="size-5 text-[#F97316]" /> My enterprises
                        </Link>
                        <Link
                            href={route('partner.documents.index')}
                            className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                        >
                            <FileText className="size-5 text-[#F97316]" /> Documents
                        </Link>
                        {!isLocalProductProducer && (
                            <>
                                <Link
                                    href={route('partner.services.index')}
                                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                                >
                                    <Building2 className="size-5 text-[#F97316]" /> Services & Facilities
                                </Link>
                                <Link
                                    href={route('partner.reservations.index')}
                                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                                >
                                    <CalendarDays className="size-5 text-[#F97316]" /> Reservations
                                </Link>
                            </>
                        )}
                        {partnerWorkspace?.can_report_arrivals && (
                            <>
                                <Link
                                    href={route('partner.tourist-arrivals.index')}
                                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                                >
                                    <Users className="size-5 text-[#F97316]" /> Tourist Arrivals
                                </Link>
                                <Link
                                    href={route('partner.daily-reports.index')}
                                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                                >
                                    <CalendarCheck2 className="size-5 text-[#F97316]" /> Daily Tourist Reports
                                </Link>
                            </>
                        )}
                        {isLocalProductProducer && (
                            <>
                                <Link
                                    href={route('partner.products.index')}
                                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                                >
                                    <Package className="size-5 text-[#F97316]" /> Local Products
                                </Link>
                                <Link
                                    href={route('partner.product-orders.index')}
                                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#FFF3E6] hover:text-[#F97316]"
                                >
                                    <ShoppingBag className="size-5 text-[#F97316]" /> Product Orders
                                </Link>
                            </>
                        )}
                        <div className="mt-5 rounded-2xl bg-[#FFF3E6] p-4 text-xs leading-5 text-[#64748B]">
                            <ShieldCheck className="mb-2 size-5 text-[#0F766E]" /> Your listings are reviewed by the Hinoba-an Tourism Office before
                            public publication.
                        </div>
                    </div>
                </aside>

                <main className="min-w-0">
                    <section className="overflow-hidden rounded-3xl bg-[#0F766E] p-7 text-white shadow-xl sm:p-9">
                        <p className="text-xs font-bold tracking-[.18em] text-[#FBBF24] uppercase">
                            {isLocalProductProducer ? 'Local product producer dashboard' : 'Tourism enterprise dashboard'}
                        </p>
                        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Welcome, {auth.user.name}</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50/90">
                            {isLocalProductProducer
                                ? 'Manage your local products, monitor customer orders, and track sales from one workspace.'
                                : 'Monitor your business registration, review progress, and submitted compliance documents.'}
                        </p>
                    </section>

                    <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {activityCards.map(([value, label, Icon, color, background]) => (
                            <article key={String(label)} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                                <span className={`flex size-10 items-center justify-center rounded-xl ${background as string}`}>
                                    <Icon className={`size-5 ${color as string}`} />
                                </span>
                                <strong className="mt-4 block text-2xl">{value as string | number}</strong>
                                <span className="text-xs font-semibold text-[#64748B]">{label as string}</span>
                            </article>
                        ))}
                    </section>

                    <section className="mt-6 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
                        <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="size-5 text-[#F97316]" />
                                <h2 className="font-extrabold">{isLocalProductProducer ? 'Order trend' : 'Reservation trend'}</h2>
                            </div>
                            <div className="mt-7 flex h-44 items-end gap-3">
                                {activityTrend.map((month) => {
                                    const maximum = Math.max(1, ...activityTrend.map((item) => item.value));
                                    return (
                                        <div key={month.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                            <span className="text-xs font-bold">{month.value}</span>
                                            <div
                                                className="w-full rounded-t-lg bg-[#0F766E]"
                                                style={{ height: `${Math.max(8, (month.value / maximum) * 120)}px` }}
                                            />
                                            <span className="text-xs text-[#64748B]">{month.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                        <article className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-orange-100 p-6">
                                <div className="flex items-center gap-3">
                                    {isLocalProductProducer ? (
                                        <ShoppingBag className="size-5 text-[#0F766E]" />
                                    ) : (
                                        <CalendarCheck2 className="size-5 text-[#0F766E]" />
                                    )}
                                    <h2 className="font-extrabold">{isLocalProductProducer ? 'Recent product orders' : 'Recent reservations'}</h2>
                                </div>
                                <Link
                                    href={route(isLocalProductProducer ? 'partner.product-orders.index' : 'partner.reservations.index')}
                                    className="text-sm font-bold text-[#F97316]"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="divide-y divide-orange-50">
                                {isLocalProductProducer
                                    ? recentProductOrders.map((order) => (
                                          <Link
                                              key={order.id}
                                              href={route('partner.product-orders.show', order.id)}
                                              className="flex items-center justify-between gap-4 p-4 transition hover:bg-[#FFFBF5]"
                                          >
                                              <div>
                                                  <strong className="block text-sm">{order.customer_name}</strong>
                                                  <span className="text-xs text-[#64748B]">
                                                      {order.items[0]?.product_name ?? 'Local product'} · {order.order_number}
                                                  </span>
                                              </div>
                                              <div className="text-right">
                                                  <strong className="block text-sm text-[#F97316]">
                                                      ₱{Number(order.total_amount).toLocaleString('en-PH')}
                                                  </strong>
                                                  <span className="text-xs text-[#64748B] capitalize">{order.status.replaceAll('_', ' ')}</span>
                                              </div>
                                          </Link>
                                      ))
                                    : recentReservations.map((reservation) => (
                                          <Link
                                              key={reservation.id}
                                              href={route('partner.reservations.show', reservation.id)}
                                              className="flex items-center justify-between gap-4 p-4 transition hover:bg-[#FFFBF5]"
                                          >
                                              <div>
                                                  <strong className="block text-sm">{reservation.customer_name}</strong>
                                                  <span className="text-xs text-[#64748B]">
                                                      {reservation.items[0]?.service.name ?? 'Service'} · {reservation.reservation_number}
                                                  </span>
                                              </div>
                                              <div className="text-right">
                                                  <strong className="block text-sm text-[#F97316]">
                                                      ₱{Number(reservation.total_amount).toLocaleString('en-PH')}
                                                  </strong>
                                                  <span className="text-xs text-[#64748B] capitalize">{reservation.status}</span>
                                              </div>
                                          </Link>
                                      ))}
                                {(isLocalProductProducer ? recentProductOrders.length === 0 : recentReservations.length === 0) && (
                                    <p className="p-8 text-center text-sm text-[#64748B]">
                                        {isLocalProductProducer
                                            ? 'No product orders have been submitted yet.'
                                            : 'No reservations have been submitted yet.'}
                                    </p>
                                )}
                            </div>
                        </article>
                    </section>

                    <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {[
                            [statistics.enterprises, 'Registered businesses', Building2, 'text-[#F97316]', 'bg-orange-50'],
                            [statistics.approved, 'Approved', CheckCircle2, 'text-[#0F766E]', 'bg-teal-50'],
                            [statistics.pending, 'Under review', Clock3, 'text-amber-600', 'bg-amber-50'],
                            [statistics.documents, 'Documents', FileCheck2, 'text-sky-700', 'bg-sky-50'],
                        ].map(([value, label, Icon, color, background]) => (
                            <article key={String(label)} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                                <span className={`flex size-10 items-center justify-center rounded-xl ${background as string}`}>
                                    <Icon className={`size-5 ${color as string}`} />
                                </span>
                                <strong className="mt-4 block text-2xl">{value as number}</strong>
                                <span className="text-xs font-semibold text-[#64748B]">{label as string}</span>
                            </article>
                        ))}
                    </section>

                    <div className="mt-9 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-[.16em] text-[#F97316] uppercase">Business registrations</p>
                            <h2 className="mt-2 text-2xl font-extrabold">Your tourism enterprises</h2>
                        </div>
                    </div>

                    <section className="mt-5 grid gap-5">
                        {enterprises.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-10 text-center">
                                <Building2 className="mx-auto size-10 text-[#F97316]" />
                                <h3 className="mt-4 text-lg font-bold">No enterprise registration found</h3>
                                <p className="mt-2 text-sm text-[#64748B]">Contact the Tourism Office if your registration should appear here.</p>
                            </div>
                        ) : (
                            enterprises.map((enterprise) => {
                                const progress =
                                    enterprise.documents_count === 0
                                        ? 0
                                        : Math.round((enterprise.verified_documents_count / enterprise.documents_count) * 100);
                                return (
                                    <article key={enterprise.id} className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                                        <div className="grid md:grid-cols-[220px_1fr]">
                                            <div className="relative min-h-48 bg-[#FFF3E6]">
                                                <img
                                                    src={enterprise.cover_image_url ?? '/images/landing/hinobaan-hero.png'}
                                                    alt={enterprise.business_name}
                                                    className="absolute inset-0 size-full object-cover"
                                                />
                                                {enterprise.logo_url && (
                                                    <img
                                                        src={enterprise.logo_url}
                                                        alt=""
                                                        className="absolute bottom-4 left-4 size-14 rounded-xl border-2 border-white bg-white object-cover shadow-lg"
                                                    />
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <span className="text-xs font-bold tracking-wide text-[#0F766E] uppercase">
                                                            {enterprise.enterprise_type?.name ?? 'Tourism Enterprise'}
                                                        </span>
                                                        <h3 className="mt-1 text-2xl font-extrabold">{enterprise.business_name}</h3>
                                                    </div>
                                                    <span
                                                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ${statusStyles[enterprise.application_status] ?? statusStyles.pending}`}
                                                    >
                                                        {enterprise.application_status}
                                                    </span>
                                                </div>
                                                <p className="mt-3 flex items-start gap-2 text-sm text-[#64748B]">
                                                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#F97316]" />{' '}
                                                    {enterprise.address ||
                                                        (enterprise.barangay ? `Barangay ${enterprise.barangay.name}` : 'Hinoba-an')}
                                                </p>
                                                {enterprise.description && (
                                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">{enterprise.description}</p>
                                                )}
                                                {enterprise.rejection_reason && (
                                                    <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                                                        <strong>Review note:</strong> {enterprise.rejection_reason}
                                                    </div>
                                                )}
                                                <div className="mt-5 border-t border-orange-100 pt-4">
                                                    <div className="flex items-center justify-between text-xs font-semibold">
                                                        <span className="text-[#64748B]">Verified documents</span>
                                                        <span>
                                                            {enterprise.verified_documents_count} of {enterprise.documents_count}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                        <div className="h-full rounded-full bg-[#0F766E]" style={{ width: `${progress}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
