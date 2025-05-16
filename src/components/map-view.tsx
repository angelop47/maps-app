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
import { CATEGORIES } from "@/lib/data";
import type { Location, CategoryId } from "@/lib/data";
import publicIcon from "@/assets/public.png";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Constantes para el mapa
const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const mapboxStyle = "streets-v11";
const mapboxTileUrl = `https://api.mapbox.com/styles/v1/mapbox/${mapboxStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`;

// Función que crea un icono personalizado según la categoría
const customIcon = (type: CategoryId) => {
  const cat = CATEGORIES.find((c) => c.id === type);
  return new Icon({
    iconUrl: cat?.icon ?? publicIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Icono para el marcador temporal (al seleccionar ubicación)
const tempIcon = new DivIcon({
  html: `<div class="w-6 h-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white animate-pulse"></div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Componente que controla el comportamiento del mapa
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

  // Cuando se selecciona una ubicación, centra el mapa en ella
  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 16, {
        animate: true,
        duration: 1,
      });
    }
  }, [map, selectedLocation]);

  // Captura el clic en el mapa si se está seleccionando una nueva ubicación
  useMapEvents({
    click(e) {
      if (isSelectingLocation) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

// Props del componente principal MapView
interface MapViewProps {
  selectedLocation: Location | null;
  locations: Location[];
  isSelectingLocation: boolean;
  onMapClick: (lat: number, lng: number) => void;
}

// Componente que muestra el mapa principal con todas las ubicaciones
export default function MapView({
  selectedLocation,
  isSelectingLocation,
  onMapClick,
}: MapViewProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [tempMarker, setTempMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Refs para abrir popups dinámicamente
  const popupRefs = useRef<Record<string, LeafletMarker>>(Object.create(null));

  // Evita problemas de renderizado en SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Limpia referencias anteriores al actualizar ubicaciones
  useEffect(() => {
    popupRefs.current = {};
  }, [locations]);

  // Abre el popup del marcador seleccionado
  useEffect(() => {
    if (selectedLocation) {
      const marker = popupRefs.current[selectedLocation.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedLocation]);

  // Obtiene las ubicaciones desde Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      const snapshot = await getDocs(collection(db, "locations"));
      const data = snapshot.docs.map((doc) => doc.data() as Location);
      setLocations(data);
    };

    fetchLocations();
  }, []);

  // Mostrar mensaje de carga mientras se monta el mapa
  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Banner superior cuando se selecciona ubicación */}
      {isSelectingLocation && (
        <div
          role="alert"
          className="absolute top-0 left-0 right-0 z-10 bg-yellow-100 p-2 text-center text-sm"
        >
          Haz clic en el mapa para seleccionar la ubicación
        </div>
      )}

      {/* Mapa base */}
      <MapContainer
        center={[-34.4713, -57.8519]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url={mapboxTileUrl} tileSize={512} zoomOffset={-1} />

        {/* Controlador del mapa (centra, maneja clics) */}
        <MapController
          selectedLocation={selectedLocation}
          isSelectingLocation={isSelectingLocation}
          onMapClick={(lat, lng) => {
            setTempMarker({ lat, lng });
            onMapClick(lat, lng);
          }}
        />

        {/* Marcadores de ubicaciones */}
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
                <p className="text-sm text-gray-500">{location.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marcador temporal al seleccionar nueva ubicación */}
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
