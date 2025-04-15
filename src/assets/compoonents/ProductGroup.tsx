import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import ProductGroupDialog from "../compoonents/AddProductGroupDialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store.ts";
import { setProducts } from "../Redux/dataSlice.ts";
import { useNavigate } from "react-router-dom";

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

export default function ProductGroups() {
   const navigate = useNavigate();
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);  
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const products = useSelector((state : RootState) => state.data.products);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchProductGroups();
      dispatch(setProducts(data)); // Update Redux state
      setProductGroups(data); // Update local state
    }
  
    if (products.length === 0) {
      // Fetch only when the page is opened for the first time
      fetchData();
    } else {
      // Use Redux state directly for subsequent renders
      setProductGroups(products);
    }
  
  }, [dispatch, products]);// Re-fetch only when refresh changes

  useEffect(() => {
    async function fetchData() {
      const data = await fetchProductGroups();
      dispatch(setProducts(data)); // Update Redux state
      setProductGroups(data); // Update local state
    }
    if(refresh){
      fetchData();
      setRefresh(false);
    }
  }, [refresh])
  

  async function deleteProductGroup(groupName: string, setRefresh: (state: boolean) => void, refresh: boolean) {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteproductgroup", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupName }),
    });
    const data = await fetchProductGroups();
    dispatch(setProducts(data));
    setProductGroups(products);
    if (response.status === 200) {
      alert("Product group deleted");
      setRefresh(!refresh);
    } else {
      alert("Error deleting product group");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📦 Product Groups</h1>
        <button
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      onClick={() => navigate("/product-group-form")}
    >
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

      <table className="w-full">
        <thead className="bg-sky-50">
          <tr className="">
            <th className="px-4 py-3">Group Name</th>
            <th className="px-4 py-3">Main Products</th>
            <th className="px-4 py-3">Addon Products</th>
            <th className="px-4 py-3">Color</th>
            <th className="px-4 py-3">Needs Tailoring</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productGroups.length > 0 ? (
            productGroups.map((group, index) => (
              <tr key={index} className="hover:bg-sky-50">
                <td className="px-4 py-2">{group[0]}</td>
                <td className="px-4 py-2">{group[1]}</td>
                <td className="px-4 py-2">{group[2]}</td>
                <td className="px-4 py-2">{group[3]}</td>
                <td className="px-4 py-2">{group[4] == "true" ? "Yes" : "No"}</td>
                <td className="px-4 py-2 flex gap-2">
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
