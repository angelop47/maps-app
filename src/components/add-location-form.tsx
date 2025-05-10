import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, X } from "lucide-react"
import type { Location } from "@/lib/data"

interface AddLocationFormProps {
  onAddLocation: (location: Omit<Location, "id">) => void
  onSelectLocationOnMap: () => void
  selectedCoordinates: { lat: number; lng: number } | null
  onCancel: () => void
  isSelecting: boolean
}

export default function AddLocationForm({
  onAddLocation,
  onSelectLocationOnMap,
  selectedCoordinates,
  onCancel,
  isSelecting,
}: AddLocationFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [locationType, setLocationType] = useState<"trash" | "public">("public")
  const [manualLat, setManualLat] = useState("")
  const [manualLng, setManualLng] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Usar las coordenadas seleccionadas en el mapa o las ingresadas manualmente
    const lat = selectedCoordinates ? selectedCoordinates.lat : Number.parseFloat(manualLat)
    const lng = selectedCoordinates ? selectedCoordinates.lng : Number.parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng)) {
      alert("Por favor, ingrese coordenadas válidas o seleccione una ubicación en el mapa")
      return
    }

    onAddLocation({
      name,
      description,
      address,
      lat,
      lng,
      type: locationType,
    })

    // Limpiar el formulario
    setName("")
    setDescription("")
    setAddress("")
    setLocationType("public")
    setManualLat("")
    setManualLng("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Añadir nueva ubicación</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Complete el formulario para añadir una nueva ubicación al mapa</CardDescription>
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
            <RadioGroup
              value={locationType}
              onValueChange={(value) => setLocationType(value as "trash" | "public")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Lugar público</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trash" id="trash" />
                <Label htmlFor="trash">Contenedor de basura</Label>
              </div>
            </RadioGroup>
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
                  value={selectedCoordinates ? selectedCoordinates.lat.toFixed(6) : manualLat}
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
                  value={selectedCoordinates ? selectedCoordinates.lng.toFixed(6) : manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  disabled={!!selectedCoordinates}
                />
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full mt-2" onClick={onSelectLocationOnMap}>
              <MapPin className="h-4 w-4 mr-2" />
              {isSelecting ? "Seleccionando ubicación..." : "Seleccionar ubicación en el mapa"}
            </Button>

            {selectedCoordinates && (
              <p className="text-xs text-muted-foreground">
                Ubicación seleccionada: {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir ubicación
        </Button>
      </CardFooter>
    </Card>
  )
}
