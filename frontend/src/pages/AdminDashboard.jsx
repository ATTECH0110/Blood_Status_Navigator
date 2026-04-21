import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import API from "../config";

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
      "A+": 0, "A-": 0, "B+": 0, "B-": 0,
      "O+": 0, "O-": 0, "AB+": 0, "AB-": 0,
    },
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    window.location.replace("/admin");
  };

  // ================= DELETE =================
  const handleDelete = async (hospitalId, requestId) => {
    try {
      const res = await fetch(
        `${API}/api/requests/${hospitalId}/${requestId}`,
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
        loadStats();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= STATS =================
  const loadStats = async () => {
    try {
      const res = await axios.get(
        `${API}/api/admin/stats`,
        getAuthHeaders()
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= REQUESTS =================
  const loadRequests = async () => {
    try {
      const res = await fetch(`${API}/api/hospitals/all-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= CONTACT =================
  const loadContacts = async () => {
    try {
      const res = await axios.get(`${API}/api/contact`);
      setContacts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SOCKET =================
  useEffect(() => {
    const socket = io(API);

    socket.on("data-updated", () => {
      loadRequests();
      loadStats();
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    loadStats();
    loadRequests();
    loadContacts();
  }, []);

  // ================= APPROVE =================
  const approveRequest = async (hospitalId, requestId) => {
    await fetch(`${API}/api/requests/${hospitalId}/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "Approved" }),
    });

    loadRequests();
    loadStats();
  };

  // ================= REJECT =================
  const rejectRequest = async (hospitalId, requestId) => {
    await fetch(`${API}/api/requests/${hospitalId}/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "Rejected" }),
    });

    loadRequests();
    loadStats();
  };

  // ================= ADD HOSPITAL =================
  const addHospital = async () => {
    try {
      await axios.post(
        `${API}/api/hospitals/add`,
        form,
        getAuthHeaders()
      );

      alert("Hospital Added");
      loadStats();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      <h2>Total Hospitals: {data.totalHospitals}</h2>

      <button onClick={addHospital}>Add Hospital</button>

      <h2>Requests</h2>
      {requests.map((r) => (
        <div key={r._id}>
          {r.name} - {r.status}
          <button onClick={() => approveRequest(r.hospitalId, r._id)}>
            Approve
          </button>
          <button onClick={() => rejectRequest(r.hospitalId, r._id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}