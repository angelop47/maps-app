import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Plus, X } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import type { Location, CategoryId } from "@/lib/data";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Definimos las props que recibirá este formulario
interface AddLocationFormProps {
  onAddLocation: (location: Omit<Location, "id">) => void;
  onSelectLocationOnMap: () => void;
  selectedCoordinates: { lat: number; lng: number } | null;
  onCancel: () => void;
  isSelecting: boolean;
}

// Componente principal para añadir una nueva ubicación
export default function AddLocationForm({
  onAddLocation,
  onSelectLocationOnMap,
  selectedCoordinates,
  onCancel,
  isSelecting,
}: AddLocationFormProps) {
  // Estados del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [locationType, setLocationType] = useState<CategoryId>("public");

  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [loading, setLoading] = useState(false);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita recargar la página
    console.log("🔹 Formulario enviado");

    // Se determina si se usaron coordenadas seleccionadas o ingresadas manualmente
    const lat = selectedCoordinates
      ? selectedCoordinates.lat
      : Number.parseFloat(manualLat);
    const lng = selectedCoordinates
      ? selectedCoordinates.lng
      : Number.parseFloat(manualLng);

    // Validación de coordenadas
    if (isNaN(lat) || isNaN(lng)) {
      console.log("❌ Coordenadas inválidas:", lat, lng);
      alert("Por favor, ingrese coordenadas válidas o seleccione en el mapa");
      return;
    }

    // Se construye el objeto de nueva ubicación
    const newLocation: Omit<Location, "id"> = {
      name,
      description,
      address,
      lat,
      lng,
      type: locationType,
    };

    console.log("📦 Datos preparados para guardar:", newLocation);

    setLoading(true); // Se activa el estado de carga
    try {
      // Guardamos la ubicación en Firestore
      const docRef = await addDoc(collection(db, "locations"), newLocation);
      console.log("✅ Documento guardado en Firestore con ID:", docRef.id);

      // Se notifica al componente padre que se añadió una ubicación
      onAddLocation(newLocation);
      console.log("📲 Llamado onAddLocation");

      // Limpiamos el formulario
      setName("");
      setDescription("");
      setAddress("");
      setLocationType("public");
      setManualLat("");
      setManualLng("");
    } catch (error) {
      // Si hay error al guardar
      console.error("🔥 Error al guardar la ubicación:", error);
      alert("Hubo un error al guardar la ubicación");
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Render del formulario
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Añadir nueva ubicación</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Complete el formulario para añadir una nueva ubicación al mapa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre de la ubicación"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Campo: Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la ubicación"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Campo: Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              placeholder="Dirección completa"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Campo: Categoría / tipo de ubicación */}
          <div className="space-y-2">
            <Label>Tipo de ubicación</Label>
            <div className="space-y-2">
              <Label htmlFor="type">Categoría</Label>
              <select
                id="type"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as CategoryId)}
                className="w-full border rounded px-2 py-1"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo: Coordenadas */}
          <div className="space-y-2">
            <Label>Coordenadas</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="lat" className="text-xs">
                  Latitud
                </Label>
                <Input
                  id="lat"
                  placeholder="Ej: 40.4153"
                  value={
                    selectedCoordinates
                      ? selectedCoordinates.lat.toFixed(6)
                      : manualLat
                  }
                  onChange={(e) => setManualLat(e.target.value)}
                  disabled={!!selectedCoordinates}
                />
              </div>
              <div>
                <Label htmlFor="lng" className="text-xs">
                  Longitud
                </Label>
                <Input
                  id="lng"
                  placeholder="Ej: -3.7074"
                  value={
                    selectedCoordinates
                      ? selectedCoordinates.lng.toFixed(6)
                      : manualLng
                  }
                  onChange={(e) => setManualLng(e.target.value)}
                  disabled={!!selectedCoordinates}
                />
              </div>
            </div>

            {/* Botón para seleccionar ubicación en el mapa */}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={onSelectLocationOnMap}
              disabled={isSelecting}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isSelecting
                ? "Seleccionando ubicación..."
                : "Seleccionar ubicación en el mapa"}
            </Button>

            {/* Coordenadas seleccionadas */}
            {selectedCoordinates && (
              <p className="text-xs text-muted-foreground">
                Ubicación seleccionada: {selectedCoordinates.lat.toFixed(6)},{" "}
                {selectedCoordinates.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Botón de envío del formulario */}
          <Button type="submit" className="w-full" disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {loading ? "Guardando..." : "Añadir ubicación"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
