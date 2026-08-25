import { Button } from '@/components/ui/button';
import { Icon, type Marker as LeafletMarker, type LeafletMouseEvent } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Crosshair, LocateFixed, MapPinOff } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

interface Coordinates {
    latitude: number;
    longitude: number;
}

const defaultCenter: [number, number] = [12.8797, 121.774];
const defaultMarkerIcon = new Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function parseCoordinates(latitude: string, longitude: string): Coordinates | null {
    if (latitude.trim() === '' || longitude.trim() === '') return null;
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) return null;
    if (parsedLatitude < -90 || parsedLatitude > 90 || parsedLongitude < -180 || parsedLongitude > 180) return null;
    return { latitude: parsedLatitude, longitude: parsedLongitude };
}

function MapInteraction({ onSelect }: { onSelect: (coordinates: Coordinates) => void }) {
    useMapEvents({ click: (event: LeafletMouseEvent) => onSelect({ latitude: event.latlng.lat, longitude: event.latlng.lng }) });
    return null;
}

function MapSynchronizer({ coordinates }: { coordinates: Coordinates | null }) {
    const map = useMap();
    useEffect(() => {
        window.requestAnimationFrame(() => map.invalidateSize());
    }, [map]);
    useEffect(() => {
        if (coordinates) map.panTo([coordinates.latitude, coordinates.longitude]);
    }, [coordinates, map]);
    return null;
}

export function LocationPicker({
    latitude,
    longitude,
    onChange,
    disabled = false,
}: {
    latitude: string;
    longitude: string;
    onChange: (latitude: string, longitude: string) => void;
    disabled?: boolean;
}) {
    const markerRef = useRef<LeafletMarker | null>(null);
    const [locating, setLocating] = useState(false);
    const [geolocationError, setGeolocationError] = useState<string>();
    const coordinates = useMemo(() => parseCoordinates(latitude, longitude), [latitude, longitude]);
    const geolocationAvailable = typeof navigator !== 'undefined' && 'geolocation' in navigator;

    const updateLocation = useCallback(
        (nextCoordinates: Coordinates): void => {
            onChange(nextCoordinates.latitude.toFixed(7), nextCoordinates.longitude.toFixed(7));
        },
        [onChange],
    );

    function useCurrentLocation(): void {
        if (!geolocationAvailable) return;
        setLocating(true);
        setGeolocationError(undefined);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                setLocating(false);
            },
            (error) => {
                setGeolocationError(error.message || 'Your current location could not be determined.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
        );
    }

    const markerEventHandlers = useMemo(
        () => ({
            dragend: () => {
                const marker = markerRef.current;
                if (marker) {
                    const position = marker.getLatLng();
                    updateLocation({ latitude: position.lat, longitude: position.lng });
                }
            },
        }),
        [updateLocation],
    );

    return (
        <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="text-sm font-medium">Interactive location picker</p>
                    <p className="text-muted-foreground text-xs">Click the map or drag the marker. OpenStreetMap data is used without a paid API.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled || !geolocationAvailable || locating}
                        onClick={useCurrentLocation}
                    >
                        {locating ? <Crosshair className="animate-pulse" /> : <LocateFixed />}
                        {locating ? 'Locating...' : 'Use Current Location'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" disabled={disabled || !coordinates} onClick={() => onChange('', '')}>
                        <MapPinOff />
                        Clear Location
                    </Button>
                </div>
            </div>
            {!geolocationAvailable && (
                <p className="text-muted-foreground text-xs">
                    Browser geolocation is unavailable. You can still click the map or enter coordinates manually.
                </p>
            )}
            {geolocationError && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                    {geolocationError}
                </p>
            )}
            <div className="overflow-hidden rounded-xl border">
                <MapContainer
                    center={coordinates ? [coordinates.latitude, coordinates.longitude] : defaultCenter}
                    zoom={coordinates ? 15 : 6}
                    scrollWheelZoom
                    className="h-80 w-full sm:h-96"
                    attributionControl
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {!disabled && <MapInteraction onSelect={updateLocation} />}
                    <MapSynchronizer coordinates={coordinates} />
                    {coordinates && (
                        <Marker
                            ref={markerRef}
                            position={[coordinates.latitude, coordinates.longitude]}
                            icon={defaultMarkerIcon}
                            draggable={!disabled}
                            eventHandlers={markerEventHandlers}
                            title="Selected location"
                            alt="Selected location marker"
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
