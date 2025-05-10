import React from "react";
import Map from "../components/Map";

const Home = () => {
  const markers = [
    { lat: -34.9011, lng: -56.1645 }, // Montevideo
    { lat: -34.4731, lng: -54.3338 }, // Punta del Este
    { lat: -30.9056, lng: -55.5508 }, // Rivera
  ];

  return (
    <div className="flex flex-col md:flex-row h-[80vh] gap-2">
      <div className="w-full md:w-1/2 flex-1 p-2">
        <div className="w-full h-full">
          <Map markers={markers} />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex-1 p-2">
        <div className="w-full h-full bg-green-300" />
      </div>
    </div>
  );
};

export default Home;
