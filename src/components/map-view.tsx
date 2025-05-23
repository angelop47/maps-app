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
import { MapPin, Tag } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Constantes
const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Función para obtener el ícono personalizado
const customIcon = (type: CategoryId) => {
  const cat = CATEGORIES.find((c) => c.id === type);
  return new Icon({
    iconUrl: cat?.icon ?? publicIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Ícono para marcador temporal
const tempIcon = new DivIcon({
  html: `<div class="w-6 h-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white animate-pulse"></div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Componente controlador del mapa
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
  const [selectedStyle, setSelectedStyle] = useState("outdoors-v11");

  // Refs para abrir popups dinámicamente
  const popupRefs = useRef<Record<string, LeafletMarker>>(Object.create(null));

  const MAPBOX_STYLES = [
    { id: "streets-v11", name: "Streets" },
    { id: "outdoors-v11", name: "Outdoors" },
    { id: "light-v10", name: "Light" },
    { id: "dark-v10", name: "Dark" },
    { id: "satellite-v9", name: "Satellite" },
    { id: "satellite-streets-v11", name: "Satellite Streets" },
    { id: "navigation-day-v1", name: "Navigation Day" },
    { id: "navigation-night-v1", name: "Navigation Night" },
  ];

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

      {/* Selector de estilo de mapa */}
      <div className="absolute top-2 right-2 z-[9999]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {MAPBOX_STYLES.find((s) => s.id === selectedStyle)?.name ||
                "Estilo del mapa"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-[10001]">
            <DropdownMenuLabel>Estilo de mapa</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedStyle}
              onValueChange={(value) => setSelectedStyle(value)}
            >
              {MAPBOX_STYLES.map((style) => (
                <DropdownMenuRadioItem key={style.id} value={style.id}>
                  {style.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mapa */}
      <MapContainer
        center={[-34.4713, -57.8519]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/${selectedStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
          tileSize={512}
          zoomOffset={-1}
        />

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
              <div className="w-48 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-700">{location.description}</p>

                <div className="text-sm text-gray-600 border-t pt-2">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {location.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    {location.type}
                  </p>
                </div>
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
