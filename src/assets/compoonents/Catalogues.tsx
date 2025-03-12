import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import CatalogueDialog from "../compoonents/CatalogueDialog";

interface Catalogue {
  catalogueName: string;
  description: string;
}

// Fetch catalogues from the server
async function fetchCatalogues(): Promise<Catalogue[]> {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getcatalogues", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching catalogues:", error);
    return [];
  }
}

// Delete a catalogue
async function deleteCatalogue(catalogueName: string, setRefresh: (state: boolean) => void, refresh: boolean) {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletecatalogue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ catalogueName }),
  });

  if (response.status === 200) {
    alert("Catalogue deleted");
    setRefresh(!refresh);
  } else {
    alert("Error deleting catalogue");
  }
}

export default function Catalogues() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState<Catalogue | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getCatalogues() {
      const data = await fetchCatalogues();
      setCatalogues(Array.isArray(data) ? data : []);
    }
    getCatalogues();
  }, [refresh]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📚 Catalogues</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => setDialogOpen(true)}>
          <Plus size={18} /> Add Catalogue
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search catalogues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Catalogue Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogues.length > 0 ? (
            catalogues.map((catalogue, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{catalogue[0]}</td>
                <td className="border px-4 py-2">{catalogue[1]}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button className="border px-2 py-1 rounded-md bg-gray-300" onClick={() => { setEditingCatalogue(catalogue); setDialogOpen(true); }}>
                    <Edit size={16} />
                  </button>
                  <button className="border px-2 py-1 rounded-md bg-red-500 text-white" onClick={() => deleteCatalogue(catalogue[0], setRefresh, refresh)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">No catalogues found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isDialogOpen && <CatalogueDialog setDialogOpen={setDialogOpen} setRefresh={setRefresh} refresh={refresh} editingCatalogue={editingCatalogue} setEditingCatalogue={setEditingCatalogue} />}
    </div>
  );
}
