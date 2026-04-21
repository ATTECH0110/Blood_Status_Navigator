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
import API from "../config";

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

  useEffect(() => {
    const leafletPane = document.querySelector(".leaflet-pane");
    if (leafletPane) {
      leafletPane.style.zIndex = "0";
    }
  }, []);

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

  useEffect(() => {
    const socket = io(API);

    socket.on("data-updated", () => {
      console.log("Hospital stock updated");
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
        `${API}/api/requests/${selectedHospital._id}`,
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

      console.log("STATUS:", res.status);

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
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 sm:top-24 right-3 sm:right-5 z-[999999] animate-pulse max-w-[90vw]">
          <div className="bg-emerald-600/95 backdrop-blur-md text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl border border-emerald-400">
            <p className="font-bold text-xs sm:text-sm md:text-base">
              ✅ Blood Request Sent Successfully
            </p>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="w-full min-h-[calc(100vh-64px)] mt-16 bg-slate-950 text-white overflow-hidden">
        <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-64px)]">
          
          {/* ================= SIDEBAR ================= */}
          <aside className="w-full lg:w-[360px] xl:w-[390px] h-auto lg:h-[calc(100vh-64px)] bg-slate-950/95 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-slate-800 shadow-2xl z-[999] overflow-y-auto">
            <div className="p-4 sm:p-5 lg:p-6">
              
              {/* Brand */}
              <div className="mb-5">
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0">
                      🩸
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white">
                        Blood Status
                      </h1>
                      <p className="text-xs sm:text-sm font-bold text-slate-400 leading-5">
                        Navigator & Emergency Finder
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-xl mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-400 text-lg">📍</span>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Search Location
                  </h3>
                </div>

                <SearchBox setSearchPosition={setSearchPosition} />
                <CurrentLocation setSearchPosition={setSearchPosition} />

                <button
                  onClick={loadHospitals}
                  className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.99] transition duration-300 font-semibold shadow-lg text-sm sm:text-base"
                >
                  🔄 Refresh Hospitals
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-xl">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mb-2">
                    Hospitals
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                    {Array.isArray(hospitals) ? hospitals.length : 0}
                  </h2>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-xl">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mb-2">
                    Active Map
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    Live
                  </h2>
                </div>
              </div>

              {/* Clock */}
              <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-6 shadow-2xl text-center">
                <p className="text-sm text-slate-400 mb-3 tracking-wide">
                  🕒 Current Time
                </p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-400 tracking-wider break-words">
                  {time.toLocaleTimeString()}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Live system clock
                </p>
              </div>

              {/* Hint */}
              <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 shadow-lg">
                <p className="leading-6">
                  Click on any{" "}
                  <span className="text-red-400 font-semibold">
                    hospital marker
                  </span>{" "}
                  on the map to check blood stock and send request instantly.
                </p>
              </div>
            </div>
          </aside>

          {/* ================= MAP AREA ================= */}
          <main className="flex-1 relative h-[55vh] sm:h-[60vh] lg:h-[calc(100vh-64px)] min-h-[420px]">
            
            {/* Floating Top Info */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-[1000] pointer-events-none">
              <div className="max-w-full sm:max-w-fit rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-md px-4 sm:px-5 py-3 shadow-2xl pointer-events-auto">
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white">
                  🗺️ Blood Availability Navigator
                </h2>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 mt-1 leading-5">
                  Click a hospital marker to view stock & request blood
                </p>
              </div>
            </div>

            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              className="w-full h-full z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {searchPosition && <FlyTo position={searchPosition} />}

              {Array.isArray(hospitals) &&
                hospitals.map((h) =>
                  h.latitude && h.longitude ? (
                    <Marker key={h._id} position={[h.latitude, h.longitude]}>
                      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                        <div className="text-sm min-w-[180px]">
                          <div className="font-bold text-red-500 text-base mb-2">
                            {h.name}
                          </div>

                          {h.bloodStock && Object.keys(h.bloodStock).length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-800">
                              {Object.entries(h.bloodStock).map(([group, value]) => (
                                <div key={group} className="font-medium">
                                  {group}: <span className="font-bold">{value}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 mt-1">
                              No Stock Available
                            </div>
                          )}
                        </div>
                      </Tooltip>

                      <Popup closeOnClick={false} autoClose={false} closeButton={true}>
                        <div className="min-w-[240px] sm:min-w-[270px] p-1">
                          <h3 className="font-bold text-red-600 text-lg sm:text-xl">
                            {h.name}
                          </h3>

                          <p className="text-sm text-gray-600 mt-1 leading-relaxed break-words">
                            {h.address}
                          </p>

                          <div className="mt-3 p-3 rounded-xl bg-slate-100 border">
                            <p className="text-sm font-semibold text-slate-800 break-all">
                              📞 {h.phone || "Not Available"}
                            </p>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-bold text-slate-800 mb-2">
                              Blood Stock
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                              {h.bloodStock &&
                                Object.entries(h.bloodStock).map(([group, value]) => (
                                  <div
                                    key={group}
                                    className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-sm flex justify-between items-center"
                                  >
                                    <span className="font-semibold text-red-700">
                                      {group}
                                    </span>
                                    <span className="font-bold text-slate-800">
                                      {value}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 mt-5">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedHospital(h);
                              }}
                              className="w-full text-sm sm:text-base bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-2xl font-semibold hover:scale-[1.02] transition shadow-lg"
                            >
                              🩸 Request Blood
                            </button>

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}&travelmode=driving`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center text-sm sm:text-base justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-2xl transition shadow-lg"
                            >
                              📍 Open Route
                            </a>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                )}
            </MapContainer>
          </main>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedHospital && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[9999] px-3 sm:px-4 py-4"
          onClick={() => setSelectedHospital(null)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-7 rounded-[28px] bg-slate-900 shadow-2xl border border-slate-700 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-3 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-red-500">
                  🩸 Blood Request
                </h2>
                <p className="text-sm text-slate-400 mt-1 leading-6">
                  Fill details to request blood
                </p>
              </div>

              <button
                onClick={() => setSelectedHospital(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition shrink-0"
              >
                ✖
              </button>
            </div>

            {/* Selected Hospital */}
            <div className="mb-5 p-4 rounded-2xl bg-slate-800 border border-slate-700">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                Selected Hospital
              </p>
              <p className="text-base sm:text-lg font-bold text-emerald-400 break-words">
                {selectedHospital.name}
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 focus:border-red-500 outline-none transition"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 focus:border-red-500 outline-none transition"
              />

              <input
                placeholder="Mobile Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 focus:border-red-500 outline-none transition"
              />

              <select
                value={form.bloodGroup}
                onChange={(e) =>
                  setForm({ ...form, bloodGroup: e.target.value })
                }
                className="w-full p-3.5 rounded-2xl bg-red-800 border border-slate-700 focus:border-blue-500 outline-none transition text-white"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>

              <input
                type="number"
                placeholder="Units Required"
                value={form.units}
                onChange={(e) => setForm({ ...form, units: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 focus:border-red-500 outline-none transition"
              />
            </div>

            {/* Button */}
            <button
              onClick={submitRequest}
              className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] active:scale-[0.99] transition font-bold shadow-xl"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* SEARCH */
function SearchBox({ setSearchPosition }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();

    if (data.length > 0) {
      setSearchPosition([
        parseFloat(data[0].lat),
        parseFloat(data[0].lon)
      ]);
    }
  };

  return (
    <>
      <input
        className="w-full p-3.5 mb-3 rounded-2xl bg-slate-800 border border-slate-700 focus:border-green-500 outline-none transition text-white placeholder:text-slate-400 text-sm sm:text-base"
        placeholder="Search city or area"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] active:scale-[0.99] transition font-semibold shadow-lg text-sm sm:text-base"
      >
        Search
      </button>
    </>
  );
}

/* CURRENT LOCATION */
function CurrentLocation({ setSearchPosition }) {
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSearchPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => alert("Location permission denied")
    );
  };

  return (
    <button
      onClick={getLocation}
      className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 hover:scale-[1.02] active:scale-[0.99] transition font-semibold shadow-lg text-sm sm:text-base"
    >
      📍 Use My Location
    </button>
  );
}

/* FLY */
function FlyTo({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 14);
  }, [position, map]);

  return null;
}