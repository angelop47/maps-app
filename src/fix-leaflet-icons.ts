import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Sobrescribir la función de íconos solo si existe
(L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl = undefined;

// Configurar los nuevos íconos
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});