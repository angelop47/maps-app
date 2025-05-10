import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type MarkerType = {
  lat: number;
  lng: number;
};

type MapProps = {
  markers: MarkerType[];
};

const Map = ({ markers }: MapProps) => {
  return (
    <MapContainer
      center={[-32.5, -55.8]} // Centro de Uruguay
      zoom={7}
      minZoom={6}
      maxZoom={18}
      maxBounds={[
        [-35.2, -59],
        [-29.5, -52],
      ]}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Popup>Marcador #{i + 1}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
