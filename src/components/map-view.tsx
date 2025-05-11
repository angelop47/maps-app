"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, DivIcon, Marker as LeafletMarker } from "leaflet";
import type { Location } from "@/lib/data";
import trashIcon from "@/assets/recycling-bin.png";
import publicIcon from "@/assets/public.png";

// Iconos personalizados para los diferentes tipos de ubicaciones
const customIcon = (type: string) =>
  new Icon({
    iconUrl: type === "trash" ? trashIcon : publicIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

// Icono para el marcador temporal
const tempIcon = new DivIcon({
  html: `<div class="w-6 h-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white animate-pulse"></div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Componente para centrar el mapa y manejar clics
function MapController({
  selectedLocation,
  isSelectingLocation,
  onMapClick,
}: {
  selectedLocation: Location | null;
  isSelectingLocation: boolean;
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 16, {
        animate: true,
        duration: 1,
      });
    }
  }, [map, selectedLocation]);

  useMapEvents({
    click(e) {
      if (isSelectingLocation) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

interface MapViewProps {
  selectedLocation: Location | null;
  locations: Location[];
  isSelectingLocation: boolean;
  onMapClick: (lat: number, lng: number) => void;
}

export default function MapView({
  selectedLocation,
  locations,
  isSelectingLocation,
  onMapClick,
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [tempMarker, setTempMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const popupRefs = useRef<Record<string, LeafletMarker>>(Object.create(null));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Limpiar referencias anteriores
    popupRefs.current = {};
  }, [locations]);

  useEffect(() => {
    if (selectedLocation) {
      const marker = popupRefs.current[selectedLocation.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedLocation]);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isSelectingLocation && (
        <div
          role="alert"
          className="absolute top-0 left-0 right-0 z-10 bg-yellow-100 p-2 text-center text-sm"
        >
          Haz clic en el mapa para seleccionar la ubicación
        </div>
      )}

      <MapContainer
        center={[-34.4713, -57.8519]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          selectedLocation={selectedLocation}
          isSelectingLocation={isSelectingLocation}
          onMapClick={(lat, lng) => {
            setTempMarker({ lat, lng });
            onMapClick(lat, lng);
          }}
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={customIcon(location.type)}
            ref={(ref) => {
              if (ref) {
                popupRefs.current[location.id] = ref;
              }
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{location.name}</h3>
                <p>{location.description}</p>
                <p className="text-sm text-gray-500">{location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]} icon={tempIcon}>
            <Popup>
              <div>
                <h3 className="font-bold">Nueva ubicación</h3>
                <p className="text-xs">
                  Coordenadas: {tempMarker.lat.toFixed(6)},{" "}
                  {tempMarker.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
