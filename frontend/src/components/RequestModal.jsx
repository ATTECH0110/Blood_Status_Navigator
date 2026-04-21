import { useState } from "react";
import api from "../services/api";

export default function RequestModal({ hospital, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "A+",
    units: 1,
  });

  const submit = async () => {
    await api.post(`/requests/${hospital._id}`, form);
    alert("Request submitted");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded w-96">
        <h3 className="text-lg font-bold mb-3">
          Request Blood – {hospital.name}
        </h3>

        <input
          className="w-full mb-2 p-2 text-black"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 text-black"
          placeholder="Phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select
          className="w-full mb-2 p-2 text-black"
          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
        >
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <input
          type="number"
          className="w-full mb-4 p-2 text-black"
          placeholder="Units"
          onChange={(e) => setForm({ ...form, units: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-600 rounded">
            Cancel
          </button>
          <button onClick={submit} className="px-3 py-1 bg-red-600 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
