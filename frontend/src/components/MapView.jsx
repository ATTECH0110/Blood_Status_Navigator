import React from "react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import RequestModal from "./RequestModal";
import { distanceKm } from "../utils/distance";

export default function MapView({ hospitals }) {
  const [userLoc, setUserLoc] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLoc([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  return (
    <>
      <MapContainer
        center={userLoc || [26.8467, 80.9462]}
        zoom={12}
        className="flex-1"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {hospitals.map((h) => (
          <Marker key={h._id} position={[h.lat, h.lng]}>
            <Popup>
              <b>{h.name}</b>
              <br />
              {userLoc && (
                <span>
                  Distance: {distanceKm(userLoc[0], userLoc[1], h.lat, h.lng)}{" "}
                  km
                </span>
              )}
              <br />
              <button
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => setSelected(h)}
              >
                Request Blood
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selected && (
        <RequestModal hospital={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
