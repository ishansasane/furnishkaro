import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import InteriorDialog from "../compoonents/InteriorDialog";
import { RootState } from "../Redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { setInteriorData } from "../Redux/dataSlice";
import { useNavigate } from "react-router-dom";

// Type for interior item (array of 4 strings)
type Interior = [string, string, string, string];

// Fetch interiors from the server
async function fetchInteriors(): Promise<Interior[]> {
  try {
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getinteriordata",
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching interiors:", error);
    return [];
  }
}

// Delete an interior record
async function deleteInterior(
  name: string,
  setRefresh: (state: boolean) => void,
  refresh: boolean
) {
  const response = await fetch(
    "https://sheeladecor.netlify.app/.netlify/functions/server/deleteinteriordata",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    }
  );

  if (response.status === 200) {
    alert("Interior deleted");
    setRefresh(!refresh);
  } else {
    alert("Error deleting interior");
  }
}

export default function Interiors() {
  const navigate = useNavigate();
  const [interiors, setInteriors] = useState<Interior[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingInterior, setEditingInterior] = useState<Interior | null>(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const interiorData = useSelector((state: RootState) => state.data.interiors);

  // Initial + refresh load
  useEffect(() => {
    async function getInteriors() {
      const data = await fetchInteriors();
      dispatch(setInteriorData(data));
      setInteriors(data);
    }

    if (refresh || interiorData.length === 0) {
      getInteriors();
      setRefresh(false);
    } else {
      setInteriors(interiorData);
    }
  }, [refresh, dispatch, interiorData]);

  // Filter interiors by Name (interior[0])
  const filteredInteriors = interiors.filter((interior) =>
    interior[0]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="md:p-6 pt-20 h-full bg-gray-50">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🏠 Interiors</h1>
        <button
          className="flex !rounded-lg items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/interior-dialog")}
        >
          <Plus size={18} /> Add Interior
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto p-5">
        <table className="w-full">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone Number</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInteriors.length > 0 ? (
              filteredInteriors.map((interior, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  <td className="px-4 py-2">{interior[0]}</td>
                  <td className="px-4 py-2">{interior[1]}</td>
                  <td className="px-4 py-2">{interior[2]}</td>
                  <td className="px-4 py-2">{interior[3]}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="border px-2 py-1 rounded-md bg-gray-300"
                      onClick={() => {
                        setEditingInterior(interior);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="border px-2 py-1 rounded-md bg-red-500 text-white"
                      onClick={() =>
                        deleteInterior(interior[0], setRefresh, refresh)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No interiors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <InteriorDialog
          setDialogOpen={setDialogOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          editingInterior={editingInterior}
          setEditingInterior={setEditingInterior}
        />
      )}
    </div>
  );
}
