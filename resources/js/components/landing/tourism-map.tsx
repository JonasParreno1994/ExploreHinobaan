import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export interface MapLocation {
    id: number;
    name: string;
    category: string | null;
    barangay: string | null;
    image: string | null;
    latitude: string;
    longitude: string;
}

const fallbackImage = '/images/landing/hinobaan-hero.png';

function escapeHtmlAttribute(value: string): string {
    return value.replace(
        /[&<>"']/g,
        (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character,
    );
}

function photoMarker(image: string | null) {
    const size = 46;
    const safeImage = escapeHtmlAttribute(image ?? fallbackImage);

    return divIcon({
        className: '',
        html: `<span style="position:relative;display:block;width:${size}px;height:${size}px;border-radius:9999px;background:white;border:4px solid #F97316;box-shadow:0 5px 18px rgba(15,23,42,.4)"><img src="${safeImage}" alt="" style="display:block;width:100%;height:100%;border-radius:9999px;object-fit:cover"/><span style="position:absolute;left:50%;bottom:-8px;width:14px;height:14px;background:#F97316;border-right:3px solid white;border-bottom:3px solid white;transform:translateX(-50%) rotate(45deg);z-index:-1"></span></span>`,
        iconSize: [size, size + 8],
        iconAnchor: [size / 2, size + 8],
        popupAnchor: [0, -(size + 4)],
    });
}

export default function TourismMap({ locations }: { locations: MapLocation[] }) {
    if (locations.length === 0) {
        return (
            <div className="flex h-[420px] flex-col items-center justify-center rounded-3xl bg-[#FFF3E6] px-6 text-center">
                <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-white text-[#F97316] shadow-sm">
                    <MapPin className="size-6" />
                </span>
                <h3 className="text-lg font-bold text-[#1F2937]">Destination map coming soon</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#64748B]">
                    Locations will appear here as destination coordinates are added by the Tourism Office.
                </p>
            </div>
        );
    }

    const center: [number, number] = [Number(locations[0].latitude), Number(locations[0].longitude)];

    return (
        <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl">
            <MapContainer center={center} zoom={11} scrollWheelZoom className="h-[420px] w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((location) => (
                    <Marker key={location.id} position={[Number(location.latitude), Number(location.longitude)]} icon={photoMarker(location.image)}>
                        <Popup>
                            <strong>{location.name}</strong>
                            <br />
                            {location.category} · {location.barangay}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
