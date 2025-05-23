"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import type { Location, CategoryId } from "@/lib/data";
import { CATEGORIES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Props que recibe el componente LocationCards
interface LocationCardsProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
}

// Componente que muestra las tarjetas de ubicaciones
export default function LocationCards({
  onSelectLocation,
}: LocationCardsProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">(
    "all"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const snapshot = await getDocs(collection(db, "locations"));
        const data = snapshot.docs.map((doc) => doc.data() as Location);
        setLocations(data);
      } catch (error) {
        console.error("Error al obtener las ubicaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filtro basado en búsqueda y categoría
  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || location.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ubicaciones..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Menú desplegable para filtrar por categoría única */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {selectedCategory === "all"
              ? "Filtrar por categoría"
              : CATEGORIES.find((c) => c.id === selectedCategory)?.name ||
                "Categoría"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Categorías</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as CategoryId | "all")
            }
          >
            <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
            {CATEGORIES.map((cat) => (
              <DropdownMenuRadioItem key={cat.id} value={cat.id}>
                {cat.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sección de tarjetas */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">
            Cargando ubicaciones...
          </p>
        ) : filteredLocations.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No se encontraron ubicaciones
          </p>
        ) : (
          filteredLocations.map((location) => {
            const category = CATEGORIES.find((c) => c.id === location.type);
            return (
              <Card key={location.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <span className="text-xs px-2 py-0.5 rounded-full">
                      {category?.name}
                    </span>
                  </div>
                  <CardDescription>{location.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{location.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onSelectLocation(location)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Ver en mapa
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
