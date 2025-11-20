"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Disable SSR for react-leaflet map
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const socket = io("http://localhost:3000");

const defaultCenter: LatLngExpression = [31.634, 74.872];


export default function PassengerPage() {

  const [busLocation, setBusLocation] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  
useEffect(() => {
  import("@/lib/lfixLeaflet");
}, []);


  useEffect(() => {
    setIsClient(true);

    socket.on("busLocationUpdate", (data) => {
      if (data.busId === "BUS101") {
        setBusLocation(data);
      }
    });

    return () => {
      socket.off("busLocationUpdate");
    };
  }, []);

  if (!isClient) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Passenger Bus Tracker</h2>

      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {busLocation && (
          <Marker position={[busLocation.lat, busLocation.lng]} />
        )}
      </MapContainer>
    </div>
  );
}
