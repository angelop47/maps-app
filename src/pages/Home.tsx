import { useState } from "react";
import MapView from "@/components/map-view";
import LocationCards from "@/components/location-cards";
import AddLocationForm from "@/components/add-location-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { locations as initialLocations, type Location } from "@/lib/data";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSelectingLocationOnMap, setIsSelectingLocationOnMap] =
    useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleAddLocation = (newLocation: Omit<Location, "id">) => {
    const newLocationWithId: Location = {
      ...newLocation,
      id: `${locations.length + 1}`,
    };

    setLocations([...locations, newLocationWithId]);
    setShowAddForm(false);
    setIsSelectingLocationOnMap(false);
    setSelectedCoordinates(null);

    // Seleccionar la nueva ubicación en el mapa
    setSelectedLocation(newLocationWithId);
  };

  const handleSelectLocationOnMap = () => {
    setIsSelectingLocationOnMap(true);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (isSelectingLocationOnMap) {
      setSelectedCoordinates({ lat, lng });
      setIsSelectingLocationOnMap(false);
    }
  };

  const handleCancelAddLocation = () => {
    setShowAddForm(false);
    setIsSelectingLocationOnMap(false);
    setSelectedCoordinates(null);
  };

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen p-6">
        <MapView
          selectedLocation={selectedLocation}
          locations={locations}
          isSelectingLocation={isSelectingLocationOnMap}
          onMapClick={handleMapClick}
        />
      </div>
      <div className="w-full md:w-1/2 p-4 overflow-y-auto md:max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Ubicaciones</h1>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          )}
        </div>

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
