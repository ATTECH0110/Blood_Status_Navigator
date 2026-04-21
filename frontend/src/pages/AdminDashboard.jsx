import React, { useEffect, useState } from "react";

import axios from "axios";
import { io } from "socket.io-client";


export default function AdminDashboard() {
  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState([]);
  const [contacts, setContacts] = useState([]);







  const [data, setData] = useState({
    totalHospitals: 0,
    totalRequests: 0,
    pending: 0,
    approved: 0,
    hospitals: [],
  });

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    bloodStock: {
      "A+": 0,
      "A-": 0,
      "B+": 0,
      "B-": 0,
      "O+": 0,
      "O-": 0,
      "AB+": 0,
      "AB-": 0,
    },
  });

  // ================= TOKEN HELPER =================
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    window.location.replace("/admin");
  };

  // ================= DELETE REQUEST =================
  const handleDelete = async (hospitalId, requestId) => {
    if (!window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${hospitalId}/${requestId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
        alert("Request deleted successfully");
        loadStats();
      } else {
        const errorData = await res.json();
        alert(errorData.msg || "Delete failed");
      }
    } catch (error) {
      console.log("Delete error:", error);
      alert("Something went wrong while deleting");
    }
  };

  // ================= LOAD STATS =================
  const loadStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        getAuthHeaders()
      );

      setData({
        totalHospitals: res.data.totalHospitals || 0,
        totalRequests: res.data.totalRequests || 0,
        pending: res.data.pending || 0,
        approved: res.data.approved || 0,
        hospitals: Array.isArray(res.data.hospitals) ? res.data.hospitals : [],
      });
    } catch (err) {
      console.log("Stats error:", err);
      setData({
        totalHospitals: 0,
        totalRequests: 0,
        pending: 0,
        approved: 0,
        hospitals: [],
      });
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ================= LOAD REQUESTS =================
  const loadRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/hospitals/all-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        setRequests(Array.isArray(result) ? result : []);
      } else {
        console.log("Unauthorized / error:", result);
        setRequests([]);
      }
    } catch (err) {
      console.log("Request load error:", err);
      setRequests([]);
    }
  };

 useEffect(() => {
  loadRequests();
  loadContacts();
}, []);

    const loadContacts = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/contact");
    setContacts(res.data);
  } catch (err) {
    console.log("Contact load error:", err);
  }
};

  // ================= SOCKET =================
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("data-updated", () => {
      console.log("Realtime update received");
      loadRequests();
      loadStats();
    });

    return () => socket.disconnect();
  }, []);

  // ================= APPROVE =================
  const approveRequest = async (hospitalId, requestId) => {
    try {
      await fetch(
        `http://localhost:5000/api/requests/${hospitalId}/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "Approved" }),
        }
      );

      loadRequests();
      loadStats();
    } catch (err) {
      console.log("Approve error:", err);
    }
  };

  // ================= REJECT =================
  const rejectRequest = async (hospitalId, requestId) => {
    try {
      await fetch(
        `http://localhost:5000/api/requests/${hospitalId}/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "Rejected" }),
        }
      );

      loadRequests();
      loadStats();
    } catch (err) {
      console.log("Reject error:", err);
    }
  };

  // ================= GEO LOCATION =================
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));
    });
  }, []);

  const handleStockChange = (group, value) => {
    setForm({
      ...form,
      bloodStock: {
        ...form.bloodStock,
        [group]: Number(value),
      },
    });
  };

  // ================= ADD HOSPITAL =================
  const addHospital = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/hospitals/add",
        form,
        getAuthHeaders()
      );

      alert("Hospital Added");

      setForm({
        name: "",
        address: "",
        phone: "",
        latitude: form.latitude,
        longitude: form.longitude,
        bloodStock: {
          "A+": 0,
          "A-": 0,
          "B+": 0,
          "B-": 0,
          "O+": 0,
          "O-": 0,
          "AB+": 0,
          "AB-": 0,
        },
      });

      loadStats();
    } catch (err) {
      console.log("Add hospital error:", err);
      alert(err.response?.data?.msg || "Failed to add hospital");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white pt-24 px-4 sm:px-6 lg:px-8 pb-10">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
            🩸 Admin Control Panel
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Blood Status Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Manage hospitals, blood stock and user requests from one place.
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg transition duration-300 border border-red-500/30 flex items-center gap-2"
        >
          🚪 Logout
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <Card title="Hospitals" value={data.totalHospitals} color="from-blue-500 to-indigo-600" icon="🏥" />
        <Card title="Total Requests" value={data.totalRequests} color="from-purple-500 to-pink-600" icon="📩" />
        <Card title="Pending" value={data.pending} color="from-yellow-500 to-orange-500" icon="⏳" />
        <Card title="Approved" value={data.approved} color="from-green-500 to-emerald-600" icon="✅" />
      </div>

      {/* ================= ADD HOSPITAL ================= */}
      <div className="bg-slate-900/70 border border-slate-800 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl shadow-lg">
            ➕
          </div>
          <div>
            <h2 className="text-2xl font-bold">Add New Hospital</h2>
            <p className="text-slate-400 text-sm">
              Register a hospital with location and blood stock.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={form.name}
            className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Hospital Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            value={form.address}
            className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Address"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input
            value={form.phone}
            className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Hospital Phone Number"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            value={form.latitude}
            className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white"
            placeholder="Latitude"
            readOnly
          />

          <input
            value={form.longitude}
            className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white"
            placeholder="Longitude"
            readOnly
          />
        </div>

        {/* Blood Stock */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-red-300">
            Blood Stock Units
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(form.bloodStock).map((group) => (
              <div
                key={group}
                className="rounded-2xl bg-slate-800/80 border border-slate-700 p-4 shadow-lg"
              >
                <label className="mb-2 block text-sm font-bold text-red-300">
                  {group}
                </label>
                <input
                  type="number"
                  placeholder={group}
                  value={form.bloodStock[group]}
                  className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-red-500 outline-none"
                  onChange={(e) => handleStockChange(group, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={addHospital}
          className="mt-8 w-full bg-gradient-to-r from-red-500 to-pink-600 py-3.5 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition duration-300 shadow-xl"
        >
          Add Hospital
        </button>
      </div>

      {/* ================= HOSPITAL LIST ================= */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            🏥
          </div>
          <div>
            <h2 className="text-2xl font-bold">Hospital List</h2>
            <p className="text-slate-400 text-sm">
              View all registered hospitals and blood stock.
            </p>
          </div>
        </div>

        {Array.isArray(data.hospitals) && data.hospitals.length > 0 ? (
          <div className="grid xl:grid-cols-2 gap-6">
            {data.hospitals.map((h) => (
              <div
                key={h._id}
                className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl shadow-2xl hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{h.name}</h3>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      {h.address}
                    </p>

                    {h.phone && (
                      <p className="text-sm text-green-400 mt-3 font-medium">
                        📞 {h.phone}
                      </p>
                    )}
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}&travelmode=driving`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-lg transition whitespace-nowrap"
                  >
                    📍 Open in Maps
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {Object.entries(h.bloodStock || {}).map(([g, v]) => (
                    <div
                      key={g}
                      className="bg-slate-800 border border-slate-700 p-4 rounded-2xl text-center shadow-md"
                    >
                      <span className="font-semibold text-red-300 text-sm">
                        {g}
                      </span>
                      <div className="text-2xl font-extrabold mt-2 text-white">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
            No hospitals found.
          </div>
        )}
      </div>

      {/* ================= REQUEST SECTION ================= */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Blood Requests</h2>
            <p className="text-slate-400 text-sm">
              Approve, reject or remove user blood requests.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition shadow-md ${
                  filter === type
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto bg-slate-900/70 border border-slate-800 rounded-3xl shadow-2xl">
          <table className="w-full text-sm text-left min-w-[900px]">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-5 font-semibold">Name</th>
                <th className="p-5 font-semibold">Email</th>
                <th className="p-5 font-semibold">Phone</th>
                <th className="p-5 font-semibold">Hospital</th>
                <th className="p-5 font-semibold">Blood</th>
                <th className="p-5 font-semibold">Units</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(requests) &&
                requests
                  .filter((r) => filter === "All" || r.status === filter)
                  .map((r, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-800 hover:bg-slate-800/60 transition"
                    >
                      <td className="p-5">{r.name}</td>
                      <td className="p-5 text-slate-300">{r.email}</td>
                      <td className="p-5">{r.phone}</td>
                      <td className="p-5">{r.hospitalName}</td>
                      <td className="p-5 font-semibold text-red-300">
                        {r.bloodGroup}
                      </td>
                      <td className="p-5">{r.units}</td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                            r.status === "Approved"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : r.status === "Pending"
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-5">
                        {r.status === "Pending" ? (
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => approveRequest(r.hospitalId, r._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition shadow-md font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectRequest(r.hospitalId, r._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition shadow-md font-semibold"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleDelete(r.hospitalId, r._id)}
                              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition shadow-md font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(r.hospitalId, r._id)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition shadow-md font-semibold"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
                  {/* ================= CONTACT MESSAGES ================= */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            📩
          </div>
          <div>
            <h2 className="text-2xl font-bold">Contact Messages</h2>
            <p className="text-slate-400 text-sm">
              Messages submitted from the Contact Us page.
            </p>
          </div>
        </div>

        {Array.isArray(contacts) && contacts.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 pr-2">
            {contacts.map((c) => (
              <div
                key={c._id}
                className="min-w-[320px] max-w-[320px] bg-slate-900/70 border border-slate-800 p-6 rounded-3xl shadow-2xl hover:border-slate-700 transition flex-shrink-0"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  <p className="text-sm text-blue-400 break-all">{c.email}</p>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {c.message}
                </p>

                <p className="text-xs text-slate-500">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
            No contact messages found.
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, color, icon }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${color} p-6 rounded-3xl shadow-2xl hover:scale-[1.02] transition duration-300`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div className="relative z-10">
        <div className="text-2xl mb-3">{icon}</div>
        <h3 className="text-sm uppercase tracking-[0.2em] opacity-90 font-medium">
          {title}
        </h3>
        <p className="text-4xl font-extrabold mt-2">{value}</p>
      </div>
    </div>
  );
}