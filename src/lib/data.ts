import publicIcon from "@/assets/public.png";
import trashIcon from "@/assets/recycling-bin.png";
import ecoIcon from "@/assets/eco-center.png";
import culturalIcon from "@/assets/cultural.png";
import dangerIcon from "@/assets/danger.png";
import parkIcon from "@/assets/park.png";
import restaurantIcon from "@/assets/restaurant.png";


export type Location = {
  id: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  type: CategoryId;
}

export const locations: Location[] = []

export type CategoryId = "public" | "trash" | "eco-center" | "cultural" | "danger" | "park" | "restaurant";

export const CATEGORIES: { id: CategoryId; name: string; icon: string; }[] = [
  { id: "public", name: "Lugar público", icon: publicIcon },
  { id: "trash", name: "Contenedor de basura", icon: trashIcon },
  { id: "eco-center", name: "Centro ecológico", icon: ecoIcon },
  { id: "cultural", name: "Sitio cultural", icon: culturalIcon},
  { id: "danger", name: "Zona peligrosa", icon: dangerIcon },
  { id: "park", name: "Parque", icon: parkIcon },
  { id: "restaurant", name: "Restaurante", icon: restaurantIcon },
];
