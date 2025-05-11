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

interface AddLocationFormProps {
  onAddLocation: (location: Omit<Location, "id">) => void;
  onSelectLocationOnMap: () => void;
  selectedCoordinates: { lat: number; lng: number } | null;
  onCancel: () => void;
  isSelecting: boolean;
}

export default function AddLocationForm({
  onAddLocation,
  onSelectLocationOnMap,
  selectedCoordinates,
  onCancel,
  isSelecting,
}: AddLocationFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [locationType, setLocationType] = useState<CategoryId>("public");

  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔹 Formulario enviado");

    const lat = selectedCoordinates
      ? selectedCoordinates.lat
      : Number.parseFloat(manualLat);
    const lng = selectedCoordinates
      ? selectedCoordinates.lng
      : Number.parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      console.log("❌ Coordenadas inválidas:", lat, lng);
      alert("Por favor, ingrese coordenadas válidas o seleccione en el mapa");
      return;
    }

    const newLocation: Omit<Location, "id"> = {
      name,
      description,
      address,
      lat,
      lng,
      type: locationType,
    };

    console.log("📦 Datos preparados para guardar:", newLocation);

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "locations"), newLocation);
      console.log("✅ Documento guardado en Firestore con ID:", docRef.id);

      onAddLocation(newLocation); // Actualizar UI o estado
      console.log("📲 Llamado onAddLocation");

      // Limpiar el formulario
      setName("");
      setDescription("");
      setAddress("");
      setLocationType("public");
      setManualLat("");
      setManualLng("");
    } catch (error) {
      console.error("🔥 Error al guardar la ubicación:", error);
      alert("Hubo un error al guardar la ubicación");
    } finally {
      setLoading(false);
    }
  };

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

            {selectedCoordinates && (
              <p className="text-xs text-muted-foreground">
                Ubicación seleccionada: {selectedCoordinates.lat.toFixed(6)},{" "}
                {selectedCoordinates.lng.toFixed(6)}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {loading ? "Guardando..." : "Añadir ubicación"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
