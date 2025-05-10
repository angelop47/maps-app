import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Trash2, Building, Search } from "lucide-react";
import type { Location } from "@/lib/data";
import { Input } from "@/components/ui/input";

interface LocationCardsProps {
  onSelectLocation: (location: Location) => void;
  locations: Location[];
}

export default function LocationCards({
  onSelectLocation,
  locations,
}: LocationCardsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && location.type === activeTab;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ubicaciones..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="trash">Contenedores</TabsTrigger>
          <TabsTrigger value="public">Lugares Públicos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredLocations.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No se encontraron ubicaciones
          </p>
        ) : (
          filteredLocations.map((location) => (
            <Card key={location.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  {location.type === "trash" ? (
                    <Trash2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Building className="h-5 w-5 text-blue-600" />
                  )}
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
          ))
        )}
      </div>
    </div>
  );
}
