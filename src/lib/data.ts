import publicIcon from "@/assets/public.png";
import trashIcon from "@/assets/recycling-bin.png";
import ecoIcon from "@/assets/eco-center.png";
import culturalIcon from "@/assets/cultural.png";
import dangerIcon from "@/assets/danger.png";

export type CategoryId = "public" | "trash" | "eco-center" | "cultural" | "danger";

export type Location = {
  id: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  type: CategoryId;
}

export const locations: Location[] = [
  {
    id: "1",
    name: "Contenedor de Reciclaje - Rambla Costanera",
    description: "Contenedor para reciclaje de vidrio, plástico y cartón",
    address: "Rambla Costanera, Colonia del Sacramento",
    lat: -34.4755,
    lng: -57.8412,
    type: "trash",
  },
  {
    id: "2",
    name: "Punto Limpio - Terminal de Ómnibus",
    description: "Depósito para residuos electrónicos y baterías",
    address: "Av. Roosevelt, Terminal de Ómnibus, Colonia",
    lat: -34.4717,
    lng: -57.8471,
    type: "trash",
  },
  {
    id: "3",
    name: "Contenedor de Orgánicos - Mercado Municipal",
    description: "Contenedor exclusivo para residuos orgánicos",
    address: "Calle Gral. Flores, Mercado Municipal, Colonia",
    lat: -34.4739,
    lng: -57.8488,
    type: "trash",
  },
  {
    id: "4",
    name: "Barrio Histórico",
    description: "Zona colonial declarada Patrimonio de la Humanidad por la UNESCO",
    address: "Barrio Histórico, Colonia del Sacramento",
    lat: -34.4713,
    lng: -57.8519,
    type: "public",
  },
  {
    id: "5",
    name: "Plaza Mayor",
    description: "Plaza central rodeada de edificios históricos",
    address: "Plaza Mayor, Barrio Histórico, Colonia",
    lat: -34.4707,
    lng: -57.8511,
    type: "public",
  },
  {
    id: "6",
    name: "Faro de Colonia",
    description: "Faro histórico con vistas panorámicas del Río de la Plata",
    address: "Calle del Comercio, Barrio Histórico, Colonia",
    lat: -34.4703,
    lng: -57.8507,
    type: "public",
  },
  {
    id: "7",
    name: "Contenedor de Reciclaje - Av. Baltasar Brum",
    description: "Punto verde para materiales reciclables secos",
    address: "Av. Baltasar Brum, Colonia del Sacramento",
    lat: -34.4695,
    lng: -57.8493,
    type: "trash",
  },
  {
    id: "8",
    name: "Playa Ferrando",
    description: "Playa tranquila con acceso público y zonas de picnic",
    address: "Camino Playa Ferrando, Colonia del Sacramento",
    lat: -34.4651,
    lng: -57.8277,
    type: "public",
  },
  {
    id: "9",
    name: "Contenedor de Orgánicos - Supermercado El Dorado",
    description: "Contenedor para residuos biodegradables",
    address: "Av. Gral. Flores 452, Colonia del Sacramento",
    lat: -34.4745,
    lng: -57.8478,
    type: "trash",
  },
  {
    id: "10",
    name: "Puerto de Yates",
    description: "Puerto turístico con vistas al atardecer",
    address: "Rambla de las Américas, Colonia del Sacramento",
    lat: -34.4710,
    lng: -57.8523,
    type: "public",
  },
]


export const CATEGORIES: { id: CategoryId; name: string; icon: string; }[] = [
  { id: "public", name: "Lugar público", icon: publicIcon },
  { id: "trash", name: "Contenedor de basura", icon: trashIcon },
  { id: "eco-center", name: "Centro ecológico", icon: ecoIcon },
  { id: "cultural", name: "Sitio cultural", icon: culturalIcon},
  { id: "danger", name: "Zona peligrosa", icon: dangerIcon },
];
