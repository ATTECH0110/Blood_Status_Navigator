import api from "../services/api";

export default function RequestsTable({ hospital }) {
  const updateStatus = async (rid, status) => {
    await api.patch(
      `/requests/${hospital._id}/${rid}`,
      { status },
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    alert("Request updated");
  };

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-bold mb-3">User Requests</h3>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Blood</th>
            <th>Units</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {hospital.requests.map((r) => (
            <tr key={r._id}>
              <td>{r.name}</td>
              <td>{r.bloodGroup}</td>
              <td>{r.units}</td>
              <td>{r.status}</td>
              <td className="space-x-2">
                <button
                  onClick={() => updateStatus(r._id, "Approved")}
                  className="bg-green-600 px-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(r._id, "Rejected")}
                  className="bg-red-600 px-2 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
