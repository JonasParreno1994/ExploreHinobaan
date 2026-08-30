import { BackToLanding } from '@/components/back-to-landing';
import { SiteBrand } from '@/components/site-brand';
import { Head, Link } from '@inertiajs/react';
import { divIcon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Expand, ExternalLink, Layers3, LocateFixed, MapPin, Navigation, Phone, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

interface Place {
    id: string;
    name: string;
    description: string | null;
    address: string;
    phone: string | null;
    latitude: string;
    longitude: string;
    image: string | null;
    category: string;
    barangay: string | null;
    details_url: string | null;
    kind: 'destination' | 'enterprise';
}

const fallbackImage = '/images/landing/hinobaan-hero.png';
const defaultCenter: [number, number] = [9.585, 122.47];
const colors = ['#F97316', '#0F766E', '#C2410C', '#FBBF24', '#0284C7', '#7C3AED', '#DB2777', '#16A34A'];
const visitorMarker = divIcon({
    className: '',
    html: '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#0284C7;border:4px solid white;box-shadow:0 0 0 5px rgba(2,132,199,.22),0 4px 14px rgba(15,23,42,.35)"></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

function escapeHtmlAttribute(value: string): string {
    return value.replace(
        /[&<>"']/g,
        (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character,
    );
}

function markerIcon(image: string | null, color: string, selected: boolean) {
    const size = selected ? 56 : 46;
    const safeImage = escapeHtmlAttribute(image ?? fallbackImage);
    return divIcon({
        className: '',
        html: `<span style="position:relative;display:block;width:${size}px;height:${size}px;border-radius:9999px;background:white;border:4px solid ${color};box-shadow:0 5px 18px rgba(15,23,42,.4)"><img src="${safeImage}" alt="" style="display:block;width:100%;height:100%;border-radius:9999px;object-fit:cover"/><span style="position:absolute;left:50%;bottom:-8px;width:14px;height:14px;background:${color};border-right:3px solid white;border-bottom:3px solid white;transform:translateX(-50%) rotate(45deg);z-index:-1"></span></span>`,
        iconSize: [size, size + 8],
        iconAnchor: [size / 2, size + 8],
        popupAnchor: [0, -(size + 4)],
    });
}

function MapActions({
    places,
    focusedId,
    recenterSignal,
    visitorLocation,
}: {
    places: Place[];
    focusedId: string | null;
    recenterSignal: number;
    visitorLocation: [number, number] | null;
}) {
    const map = useMap();
    useEffect(() => {
        if (places.length === 0) {
            map.setView(defaultCenter, 11);
            return;
        }
        const bounds = latLngBounds(places.map((place) => [Number(place.latitude), Number(place.longitude)]));
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 14 });
    }, [map, places, recenterSignal]);
    useEffect(() => {
        const place = places.find((item) => item.id === focusedId);
        if (!place) return;

        const destination: [number, number] = [Number(place.latitude), Number(place.longitude)];
        if (visitorLocation) {
            map.fitBounds(latLngBounds([visitorLocation, destination]), { padding: [70, 70], maxZoom: 15 });
            return;
        }

        map.flyTo(destination, 16, { duration: 0.8 });
    }, [focusedId, map, places, visitorLocation]);
    return null;
}

export default function InteractiveMap({ places }: { places: Place[] }) {
    const [query, setQuery] = useState('');
    const [activeCategories, setActiveCategories] = useState<Set<string>>(() => new Set(places.map((place) => place.category)));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [satellite, setSatellite] = useState(false);
    const [recenterSignal, setRecenterSignal] = useState(0);
    const [visitorLocation, setVisitorLocation] = useState<[number, number] | null>(null);
    const [locating, setLocating] = useState(false);
    const [locationMessage, setLocationMessage] = useState<string | null>(null);
    const mapAreaRef = useRef<HTMLElement>(null);
    const categories = useMemo(() => [...new Set(places.map((place) => place.category))].sort(), [places]);
    const categoryColors = useMemo(
        () => Object.fromEntries(categories.map((category, index) => [category, colors[index % colors.length]])),
        [categories],
    );
    const filteredPlaces = useMemo(
        () =>
            places.filter(
                (place) =>
                    activeCategories.has(place.category) &&
                    `${place.name} ${place.description ?? ''} ${place.address} ${place.barangay ?? ''}`
                        .toLowerCase()
                        .includes(query.toLowerCase().trim()),
            ),
        [activeCategories, places, query],
    );
    const focusedPlace = places.find((place) => place.id === focusedId) ?? null;

    function toggleCategory(category: string): void {
        setActiveCategories((current) => {
            const next = new Set(current);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return next;
        });
    }

    function focusPlace(place: Place): void {
        setFocusedId(place.id);
        setSidebarOpen(false);
        if (visitorLocation) {
            setLocationMessage(`Showing the line to ${place.name}.`);
        }
    }

    function locateVisitor(): void {
        if (!navigator.geolocation) {
            setLocationMessage('Location services are not supported by this browser.');
            return;
        }

        setLocating(true);
        setLocationMessage(null);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setVisitorLocation([coords.latitude, coords.longitude]);
                setLocationMessage(focusedPlace ? `Showing the line to ${focusedPlace.name}.` : 'Select a destination to draw the route line.');
                setLocating(false);
            },
            (error) => {
                const message =
                    error.code === error.PERMISSION_DENIED
                        ? 'Location permission was denied. Please allow location access and try again.'
                        : 'Your current location could not be determined. Please try again.';
                setLocationMessage(message);
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-[#FFFBF5] text-[#1F2937]">
            <Head title="Interactive Tourism Map | Explore Hinoba-an" />
            <header className="fixed inset-x-0 top-0 z-[1200] h-16 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur-xl">
                <nav className="mx-auto flex h-full items-center justify-between px-4 lg:px-6">
                    <Link href={route('home')} className="flex items-center gap-3 font-bold">
                        <SiteBrand compact />
                    </Link>
                    <div className="text-center">
                        <p className="hidden text-sm font-bold sm:block">Interactive Tourism Map</p>
                        <p className="hidden text-xs text-[#64748B] md:block">Discover destinations and tourism businesses</p>
                    </div>
                    <BackToLanding compact />
                </nav>
            </header>

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close filters"
                    className="fixed inset-0 z-[1050] bg-slate-950/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <aside
                className={`fixed top-16 bottom-0 left-0 z-[1100] w-[min(88vw,380px)] overflow-y-auto border-r border-orange-100 bg-white/95 shadow-2xl backdrop-blur-xl transition-transform md:w-[360px] md:translate-x-0 lg:w-[400px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-[#FFF3E6] px-5 py-4 md:hidden">
                    <h2 className="flex items-center gap-2 font-bold">
                        <SlidersHorizontal className="size-5 text-[#F97316]" />
                        Filters
                    </h2>
                    <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close filters">
                        <X />
                    </button>
                </div>
                <div className="space-y-7 p-5">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#64748B]" />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search places, activities..."
                            className="h-12 w-full rounded-2xl border border-orange-100 bg-white pr-4 pl-12 text-sm outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                        />
                    </div>
                    <section>
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold">Explore by category</h2>
                            <button
                                type="button"
                                className="text-xs font-bold text-[#F97316]"
                                onClick={() => setActiveCategories(activeCategories.size === categories.length ? new Set() : new Set(categories))}
                            >
                                {activeCategories.size === categories.length ? 'Clear all' : 'Select all'}
                            </button>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {categories.map((category) => {
                                const active = activeCategories.has(category);
                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => toggleCategory(category)}
                                        className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${active ? 'border-transparent text-white shadow-sm' : 'border-slate-200 bg-white text-[#64748B]'}`}
                                        style={active ? { backgroundColor: categoryColors[category] } : undefined}
                                    >
                                        <span className="size-2.5 shrink-0 rounded-full bg-current" />
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                    <section>
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold">Places to explore</h2>
                                <p className="text-xs text-[#64748B]">Select a card to focus its marker</p>
                            </div>
                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#F97316]">{filteredPlaces.length}</span>
                        </div>
                        <div className="mt-4 space-y-3">
                            {filteredPlaces.length ? (
                                filteredPlaces.map((place) => (
                                    <article
                                        key={place.id}
                                        className={`relative flex w-full rounded-2xl border bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-lg ${focusedId === place.id ? 'border-[#F97316] ring-2 ring-orange-100' : 'border-orange-100'}`}
                                    >
                                        <button type="button" onClick={() => focusPlace(place)} className="flex min-w-0 flex-1 gap-3 text-left">
                                            <img src={place.image ?? fallbackImage} alt="" className="h-24 w-28 shrink-0 rounded-xl object-cover" />
                                            <span className="min-w-0 py-1 pr-16">
                                                <span
                                                    className="block text-[10px] font-bold tracking-wide uppercase"
                                                    style={{ color: categoryColors[place.category] }}
                                                >
                                                    {place.category}
                                                </span>
                                                <span className="mt-1 block truncate font-bold">{place.name}</span>
                                                <span className="mt-1 flex items-center gap-1 text-xs text-[#64748B]">
                                                    <MapPin className="size-3 shrink-0" />
                                                    {place.barangay ? `Barangay ${place.barangay}` : 'Hinoba-an'}
                                                </span>
                                                <span className="mt-2 line-clamp-1 block text-xs text-[#64748B]">
                                                    {place.description || place.address}
                                                </span>
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => focusPlace(place)}
                                            className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-lg bg-[#F97316] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#C2410C]"
                                            aria-label={`Locate ${place.name} on the map`}
                                        >
                                            <LocateFixed className="size-3.5" />
                                            Locate
                                        </button>
                                    </article>
                                ))
                            ) : (
                                <div className="rounded-2xl bg-[#FFF3E6] p-8 text-center">
                                    <MapPin className="mx-auto text-[#F97316]" />
                                    <p className="mt-3 font-bold">No places found</p>
                                    <p className="mt-1 text-xs text-[#64748B]">Try another search or category.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </aside>

            <section ref={mapAreaRef} className="absolute inset-x-0 top-16 bottom-0 md:left-[360px] lg:left-[400px]">
                <MapContainer center={defaultCenter} zoom={11} zoomControl className="size-full">
                    <TileLayer
                        attribution={satellite ? 'Tiles &copy; Esri' : '&copy; OpenStreetMap contributors'}
                        url={
                            satellite
                                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    />
                    <MapActions places={filteredPlaces} focusedId={focusedId} recenterSignal={recenterSignal} visitorLocation={visitorLocation} />
                    {visitorLocation && (
                        <Marker position={visitorLocation} icon={visitorMarker}>
                            <Popup>
                                <strong>Your location</strong>
                            </Popup>
                        </Marker>
                    )}
                    {visitorLocation && focusedPlace && (
                        <Polyline
                            positions={[visitorLocation, [Number(focusedPlace.latitude), Number(focusedPlace.longitude)]]}
                            pathOptions={{ color: '#0284C7', weight: 5, opacity: 0.9, dashArray: '10 10' }}
                        />
                    )}
                    {filteredPlaces.map((place) => (
                        <Marker
                            key={place.id}
                            position={[Number(place.latitude), Number(place.longitude)]}
                            icon={markerIcon(place.image, categoryColors[place.category], focusedId === place.id)}
                            eventHandlers={{ click: () => setFocusedId(place.id) }}
                        >
                            <Popup minWidth={270} maxWidth={290}>
                                <div className="overflow-hidden text-[#1F2937]">
                                    <img src={place.image ?? fallbackImage} alt={place.name} className="h-24 w-full rounded-lg object-cover" />
                                    <div className="mt-2 rounded-lg bg-[#FFF3E6] px-3 py-2.5">
                                        <strong className="block text-lg leading-tight text-[#0F766E]">{place.name}</strong>
                                        <span className="mt-1 block text-xs font-semibold text-[#64748B]">{place.category}</span>
                                    </div>
                                    {place.description && <p className="mt-3 line-clamp-3 px-1 text-xs leading-5">{place.description}</p>}
                                    <div className="mt-3 space-y-2.5 px-1">
                                        {place.phone && (
                                            <a href={`tel:${place.phone}`} className="flex items-start gap-2 text-xs text-sky-700 hover:underline">
                                                <Phone className="mt-0.5 size-4 shrink-0 text-[#F97316]" />
                                                <span>
                                                    <small className="block text-[11px] text-[#64748B]">Phone</small>
                                                    {place.phone}
                                                </span>
                                            </a>
                                        )}
                                        <div className="flex items-start gap-2 text-xs">
                                            <MapPin className="mt-0.5 size-4 shrink-0 text-[#F97316]" />
                                            <span>
                                                <small className="block text-[11px] text-[#64748B]">Address</small>
                                                {place.address || (place.barangay ? `Barangay ${place.barangay}` : 'Hinoba-an')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2 border-t border-orange-100 pt-3">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#F97316] px-2 py-2.5 text-xs font-bold text-white hover:bg-[#C2410C]"
                                        >
                                            <Navigation className="size-4" />
                                            Get Directions
                                        </a>
                                        {place.details_url && (
                                            <a
                                                href={place.details_url}
                                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#0F766E] px-2 py-2.5 text-xs font-bold text-[#0F766E] hover:bg-[#0F766E] hover:text-white"
                                            >
                                                <ExternalLink className="size-4" />
                                                View Details
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
                <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                    <button
                        type="button"
                        title="Show my location and route line"
                        onClick={locateVisitor}
                        disabled={locating}
                        className="flex h-11 items-center gap-2 rounded-xl bg-[#0284C7] px-3 text-sm font-bold text-white shadow-lg transition hover:bg-sky-700 disabled:cursor-wait disabled:opacity-70"
                    >
                        <LocateFixed className={`size-5 ${locating ? 'animate-pulse' : ''}`} />
                        {locating ? 'Locating...' : 'My Location'}
                    </button>
                    <button
                        type="button"
                        title="Recenter map"
                        onClick={() => {
                            setFocusedId(null);
                            setRecenterSignal((value) => value + 1);
                        }}
                        className="flex size-11 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-lg"
                    >
                        <LocateFixed />
                    </button>
                    <button
                        type="button"
                        title="Toggle map layer"
                        onClick={() => setSatellite((value) => !value)}
                        className={`flex size-11 items-center justify-center rounded-xl shadow-lg ${satellite ? 'bg-[#0F766E] text-white' : 'bg-white text-[#0F766E]'}`}
                    >
                        <Layers3 />
                    </button>
                    <button
                        type="button"
                        title="Toggle fullscreen"
                        onClick={() => (document.fullscreenElement ? document.exitFullscreen() : mapAreaRef.current?.requestFullscreen())}
                        className="flex size-11 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-lg"
                    >
                        <Expand />
                    </button>
                </div>
                {locationMessage && (
                    <div
                        role="status"
                        className="absolute top-4 left-4 z-[1000] max-w-[min(75vw,360px)] rounded-xl bg-white/95 px-4 py-3 text-sm font-semibold text-[#1F2937] shadow-lg backdrop-blur"
                    >
                        {locationMessage}
                    </div>
                )}
                <div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold shadow-lg backdrop-blur">
                    Showing {filteredPlaces.length} mapped place{filteredPlaces.length === 1 ? '' : 's'}
                </div>
            </section>

            <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="fixed bottom-6 left-5 z-[1000] flex items-center gap-2 rounded-full bg-[#F97316] px-5 py-3 font-bold text-white shadow-xl md:hidden"
            >
                <SlidersHorizontal className="size-5" /> Explore
            </button>
        </div>
    );
}
