import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import API from "../config"; // ✅ IMPORTANT

window.L = L;

/* Fix leaflet icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

export default function UserMap() {
  const [hospitals, setHospitals] = useState([]);
  const [searchPosition, setSearchPosition] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [time, setTime] = useState(new Date());

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    units: ""
  });

  /* Clock */
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* Load hospitals */
  const loadHospitals = async () => {
    try {
      const res = await axios.get(`${API}/api/hospitals/public`);
      setHospitals(res.data);
    } catch (err) {
      console.log("Hospital load error:", err);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  /* Socket */
  useEffect(() => {
    const socket = io(API); // ✅ FIXED

    socket.on("data-updated", () => {
      loadHospitals();
    });

    return () => socket.disconnect();
  }, []);

  /* Submit */
  const submitRequest = async () => {
    if (!selectedHospital) return;

    if (!form.name || !form.phone || !form.bloodGroup || !form.units) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(
        `${API}/api/requests/${selectedHospital._id}`, // ✅ FIXED
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...form,
            units: Number(form.units)
          })
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.msg || "Request Failed");
        return;
      }

      setShowToast(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        bloodGroup: "",
        units: ""
      });

      setTimeout(() => {
        setShowToast(false);
        setSelectedHospital(null);
      }, 2000);
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <>
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-5 z-[9999] bg-green-600 text-white px-4 py-3 rounded-xl">
          ✅ Request Sent
        </div>
      )}

      <div className="w-full h-screen">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {searchPosition && <FlyTo position={searchPosition} />}

          {hospitals.map((h) =>
            h.latitude && h.longitude ? (
              <Marker key={h._id} position={[h.latitude, h.longitude]}>
                <Tooltip>{h.name}</Tooltip>

                <Popup>
                  <b>{h.name}</b>
                  <br />
                  {h.address}
                  <br />
                  📞 {h.phone}

                  <br />
                  <button
                    onClick={() => setSelectedHospital(h)}
                    className="bg-red-500 text-white px-3 py-2 mt-2 rounded"
                  >
                    Request Blood
                  </button>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-3">
              Request Blood - {selectedHospital.name}
            </h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="input mb-2"
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="input mb-2"
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="input mb-2"
            />

            <input
              placeholder="Blood Group"
              value={form.bloodGroup}
              onChange={(e) =>
                setForm({ ...form, bloodGroup: e.target.value })
              }
              className="input mb-2"
            />

            <input
              type="number"
              placeholder="Units"
              value={form.units}
              onChange={(e) =>
                setForm({ ...form, units: e.target.value })
              }
              className="input mb-3"
            />

            <button
              onClick={submitRequest}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* Fly */
function FlyTo({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 14);
  }, [position, map]);

  return null;
}