import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import BrandDialog from "../compoonents/BrandDialog";
import { useDispatch, useSelector } from "react-redux";
import { setBrands } from "../Redux/dataSlice";
import { RootState } from "../Redux/Store";

interface Brand {
  brandName: string;
  description: string;
}

// Fetch brands from the server
async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getbrands", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

// Delete a brand
async function deleteBrand(brandName: string, setRefresh: (state: boolean) => void, refresh: boolean) {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletebrand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ brandName }),
  });

  if (response.status === 200) {
    alert("Brand deleted");
    setRefresh(!refresh);
  } else {
    alert("Error deleting brand");
  }
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const brandData = useSelector((state : RootState) => state.data.brands);

  useEffect(() => {
    async function getBrands() {
      setBrands(brandData);
    }
    getBrands();
  }, [refresh]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🏷️ Brands</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => setDialogOpen(true)}>
          <Plus size={18} /> Add Brand
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Brand Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.length > 0 ? (
            brands.map((brand, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{brand[0]}</td>
                <td className="border px-4 py-2">{brand[1]}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button className="border px-2 py-1 rounded-md bg-gray-300" onClick={() => { setEditingBrand(brand); setDialogOpen(true); }}>
                    <Edit size={16} />
                  </button>
                  <button className="border px-2 py-1 rounded-md bg-red-500 text-white" onClick={() => deleteBrand(brand[0], setRefresh, refresh)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">No brands found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isDialogOpen && <BrandDialog setDialogOpen={setDialogOpen} setRefresh={setRefresh} refresh={refresh} editingBrand={editingBrand} setEditingBrand={setEditingBrand} />}
    </div>
  );
}
