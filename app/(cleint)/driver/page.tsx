"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function DriverPage() {

  const busId = "BUS101";

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    navigator.geolocation.watchPosition((position) => {
      const data = {
        busId,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      socket.emit("driverLocationUpdate", data);
      console.log("Location sent:", data);

    }, (error) => {
      console.error("GPS Error:", error);
    });

  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Driver Dashboard</h2>
      <p>Sharing Live Location for Bus: {busId}</p>
      <p>Keep this page open while driving</p>
    </div>
  );
}
