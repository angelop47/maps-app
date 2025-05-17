import { useState } from "react";
import MapView from "@/components/map-view";
import LocationCards from "@/components/location-cards";
import AddLocationForm from "@/components/add-location-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { locations as initialLocations, type Location } from "@/lib/data";

export default function Home() {
  // Estado para la ubicación seleccionada actualmente en el mapa
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  // Estado que contiene la lista de ubicaciones
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  // Estado para mostrar u ocultar el formulario para añadir una nueva ubicación
  const [showAddForm, setShowAddForm] = useState(false);

  // Estado que indica si el usuario está seleccionando una ubicación directamente desde el mapa
  const [isSelectingLocationOnMap, setIsSelectingLocationOnMap] =
    useState(false);

  // Estado que guarda las coordenadas seleccionadas en el mapa
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Maneja la selección de una ubicación desde la lista
  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  // Agrega una nueva ubicación a la lista
  const handleAddLocation = (newLocation: Omit<Location, "id">) => {
    const newLocationWithId: Location = {
      ...newLocation,
      id: `${locations.length + 1}`, // Genera un ID simple basado en la cantidad
    };

    // Actualiza el estado con la nueva ubicación
    setLocations([...locations, newLocationWithId]);
    setShowAddForm(false);
    setIsSelectingLocationOnMap(false);
    setSelectedCoordinates(null);

    // Selecciona automáticamente la nueva ubicación
    setSelectedLocation(newLocationWithId);
  };

  // Activa el modo de selección de coordenadas en el mapa
  const handleSelectLocationOnMap = () => {
    setIsSelectingLocationOnMap(true);
  };

  // Maneja el clic en el mapa para capturar coordenadas
  const handleMapClick = (lat: number, lng: number) => {
    if (isSelectingLocationOnMap) {
      setSelectedCoordinates({ lat, lng });
      setIsSelectingLocationOnMap(false);
    }
  };

  // Cancela el proceso de agregar una nueva ubicación
  const handleCancelAddLocation = () => {
    setShowAddForm(false);
    setIsSelectingLocationOnMap(false);
    setSelectedCoordinates(null);
  };

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Contenedor del mapa - fijo en móvil, relativo en escritorio */}
      <div
        className={`w-full md:w-1/2 h-[70vh] md:h-screen md:relative fixed md:static top-0 left-0 z-0`}
      >
        <MapView
          selectedLocation={selectedLocation}
          locations={locations}
          isSelectingLocation={isSelectingLocationOnMap}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Contenedor del panel derecho con contenido deslizable en móvil */}
      <div
        className={`bg-white rounded-xs w-full md:w-1/2 p-4 overflow-y-auto md:max-h-screen relative z-10 mt-[70vh] md:mt-0`}
      >
        {/* Título y botón para mostrar el formulario de nueva ubicación */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Ubicaciones</h1>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          )}
        </div>

        {/* Muestra el formulario o la lista de ubicaciones */}
        {showAddForm ? (
          <AddLocationForm
            onAddLocation={handleAddLocation}
            onSelectLocationOnMap={handleSelectLocationOnMap}
            selectedCoordinates={selectedCoordinates}
            onCancel={handleCancelAddLocation}
            isSelecting={isSelectingLocationOnMap}
          />
        ) : (
          <LocationCards
            onSelectLocation={handleSelectLocation}
            locations={locations}
          />
        )}
      </div>
    </main>
  );
}
