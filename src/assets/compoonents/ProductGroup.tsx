import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import ProductGroupDialog from "../compoonents/AddProductGroupDialog";

interface ProductGroup {
  groupName: string;
  mainProducts: string;
  addonProducts: string;
  color: string;
  needsTailoring: boolean;
}

// Fetch product groups from the server
async function fetchProductGroups(): Promise<ProductGroup[]> {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getallproductgroup", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching product groups:", error);
    return [];
  }
}

// Delete a product group
async function deleteProductGroup(groupName: string, setRefresh: (state: boolean) => void, refresh: boolean) {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteproductgroup", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ groupName }),
  });

  if (response.status === 200) {
    alert("Product group deleted");
    setRefresh(!refresh);
  } else {
    alert("Error deleting product group");
  }
}

export default function ProductGroups() {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getProductGroups() {
      const data = await fetchProductGroups();
      setProductGroups(Array.isArray(data) ? data : []);
    }
    getProductGroups();
  }, [refresh]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📦 Product Groups</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => setDialogOpen(true)}>
          <Plus size={18} /> Add Product Group
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search product groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Group Name</th>
            <th className="border px-4 py-2">Main Products</th>
            <th className="border px-4 py-2">Addon Products</th>
            <th className="border px-4 py-2">Color</th>
            <th className="border px-4 py-2">Needs Tailoring</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productGroups.length > 0 ? (
            productGroups.map((group, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{group[0]}</td>
                <td className="border px-4 py-2">{group[1]}</td>
                <td className="border px-4 py-2">{group[2]}</td>
                <td className="border px-4 py-2">{group[3]}</td>
                <td className="border px-4 py-2">{group[4] == "true" ? "Yes" : "No"}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button className="border px-2 py-1 rounded-md bg-gray-300" onClick={() => { setEditingGroup(group); setDialogOpen(true); }}>
                    <Edit size={16} />
                  </button>
                  <button className="border px-2 py-1 rounded-md bg-red-500 text-white" onClick={() => deleteProductGroup(group[0], setRefresh, refresh)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">No product groups found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isDialogOpen && <ProductGroupDialog setDialogOpen={setDialogOpen} setRefresh={setRefresh} refresh={refresh} editingGroup={editingGroup} setediting = {setEditingGroup}/>}
    </div>
  );
}
