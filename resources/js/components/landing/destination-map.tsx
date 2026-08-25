import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const markerIcon = divIcon({
    className: '',
    html: '<span style="display:block;width:28px;height:28px;border-radius:50% 50% 50% 0;background:#F97316;border:3px solid white;box-shadow:0 3px 12px rgba(0,0,0,.3);transform:rotate(-45deg)"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

interface DestinationMapProps {
    name: string;
    address: string;
    latitude: string | null;
    longitude: string | null;
}

export default function DestinationMap({ name, address, latitude, longitude }: DestinationMapProps) {
    if (!latitude || !longitude || !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
        return (
            <div className="flex h-80 flex-col items-center justify-center rounded-3xl bg-[#FFF3E6] px-6 text-center">
                <MapPin className="size-10 text-[#F97316]" />
                <p className="mt-4 font-semibold text-[#1F2937]">Map location is not available for this destination.</p>
            </div>
        );
    }

    const position: [number, number] = [Number(latitude), Number(longitude)];

    return (
        <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl">
            <MapContainer center={position} zoom={15} scrollWheelZoom className="h-[420px] w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={markerIcon}>
                    <Popup>
                        <strong>{name}</strong>
                        <br />
                        {address}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
