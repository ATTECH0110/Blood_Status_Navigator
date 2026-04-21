import api from "../services/api";

export default function BloodCard({ hospital, blood }) {
  const update = async (units) => {
    const updated = hospital.bloodStock.map((b) =>
      b.group === blood.group
        ? { ...b, units, status: units < 5 ? "Low" : "Available" }
        : b
    );

    await api.patch(
      `/hospitals/${hospital._id}`,
      { bloodStock: updated },
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-bold">{blood.group}</h3>
      <p className="text-sm">Units: {blood.units}</p>

      <input
        type="number"
        className="mt-2 w-full p-1 text-black"
        defaultValue={blood.units}
        onBlur={(e) => update(Number(e.target.value))}
      />
    </div>
  );
}
