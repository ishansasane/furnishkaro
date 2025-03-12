import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import TailorDialog from "../compoonents/TailorDialog";

interface Tailor {
  tailorName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

// Fetch Tailors
async function fetchTailors(): Promise<Tailor[]> {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettailors", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching tailors:", error);
    return [];
  }
}

// Delete a Tailor
async function deleteTailor(tailorName: string, setRefresh: (state: boolean) => void, refresh: boolean) {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetailor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tailorName }),
  });

  if (response.status === 200) {
    alert("Tailor deleted");
    setRefresh(!refresh);
  } else {
    alert("Error deleting tailor");
  }
}

export default function Tailors() {
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingTailor, setEditingTailor] = useState<Tailor | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getTailors() {
      const data = await fetchTailors();
      setTailors(Array.isArray(data) ? data : []);
    }
    getTailors();
  }, [refresh]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">👗 Tailors</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => setDialogOpen(true)}>
          <Plus size={18} /> Add Tailor
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tailors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Tailor Name</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tailors.length > 0 ? (
            tailors.map((tailor, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{tailor[0]}</td>
                <td className="border px-4 py-2">{tailor[1]}</td>
                <td className="border px-4 py-2">{tailor[2]}</td>
                <td className="border px-4 py-2">{tailor[3]}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button className="border px-2 py-1 rounded-md bg-gray-300" onClick={() => { setEditingTailor(tailor); setDialogOpen(true); }}>
                    <Edit size={16} />
                  </button>
                  <button className="border px-2 py-1 rounded-md bg-red-500 text-white" onClick={() => deleteTailor(tailor[0], setRefresh, refresh)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">No tailors found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isDialogOpen && <TailorDialog setDialogOpen={setDialogOpen} setRefresh={setRefresh} refresh={refresh} editingTailor={editingTailor} setEditingTailor={setEditingTailor} />}
    </div>
  );
}
