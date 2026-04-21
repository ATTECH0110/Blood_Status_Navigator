import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/api/hospitals");
    setHospitals(res.data);
  };

  const addHospital = async () => {
    await axios.post("http://localhost:5000/api/hospitals", { name, address });
    setName("");
    setAddress("");
    load();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-bold mb-4">Hospitals</h1>

      <div className="bg-slate-800 p-4 rounded mb-6">
        <input
          className="input"
          placeholder="Hospital Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input mt-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          onClick={addHospital}
          className="bg-green-600 px-4 py-2 mt-3 rounded"
        >
          Add Hospital
        </button>
      </div>

      {hospitals.map((h) => (
        <div key={h._id} className="bg-slate-900 p-3 mb-2 rounded">
          <b>{h.name}</b> — {h.address}
        </div>
      ))}
    </div>
  );
}
