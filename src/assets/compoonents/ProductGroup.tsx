import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
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

export default function ProductGroups() {
  const navigate = useNavigate();
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);  
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [refresh, setRefresh] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [mainProduct, setMainProduct] = useState([]);
  const [addonProduct, setAddonProduct] = useState([]);
  const [color, setColor] = useState("#ffffff");
  const [status, setStatus] = useState(true);
  const [needsTailoring, setNeedsTailoring] = useState(false);

  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.data.items);
  const products = useSelector((state: RootState) => state.data.products);

  useEffect(() => {
    const fetchAndSetData = async () => {
      const data = await fetchProductGroups();
      dispatch(setProducts(data));
      setProductGroups(data);
      localStorage.setItem("productGroupData", JSON.stringify({ data, time: Date.now() }));
    };

    const localStorageData = localStorage.getItem("productGroupData");

    if (refresh) {
      fetchAndSetData();
      setRefresh(false);
    } else if (products.length > 0) {
      setProductGroups(products);
    } else if (localStorageData) {
      const parsed = JSON.parse(localStorageData);
      const age = Date.now() - parsed.time;

      if (age < 60 * 60 * 1000) {
        dispatch(setProducts(parsed.data));
        setProductGroups(parsed.data);
      } else {
        fetchAndSetData();
      }
    } else {
      fetchAndSetData();
    }
  }, [dispatch, products, refresh]);

  async function deleteProductGroup(groupName: string, setRefresh: (state: boolean) => void, refresh: boolean) {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteproductgroup", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupName }),
    });
    const data = await fetchProductGroups();

    dispatch(setProducts(data));
    setProductGroups(data);
    localStorage.setItem("productGroupData", JSON.stringify({ data, time: Date.now() }));

    if (response.status === 200) {
      alert("Product group deleted");
      setRefresh(!refresh);
    } else {
      alert("Error deleting product group");
    }
  }

  const handleEditGroup = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updateproductgroup", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupName, mainProducts: mainProduct, addonProducts: addonProduct, status })
    });
    const data = await fetchProductGroups();

    dispatch(setProducts(data));
    setProductGroups(data);
    localStorage.setItem("productGroupData", JSON.stringify({ data, time: Date.now() }));

    if (response.status === 200) {
      alert("Product group Edited");
      setDialogOpen(false);
    } else {
      alert("Error in editing product group");
    }
  };

  // Filtered groups based on search input
 const filteredGroups = productGroups.filter((group) => {
  const groupName = group[0]?.toLowerCase() || "";
  const searchTerm = search.toLowerCase();
  return groupName.includes(searchTerm);
});


  return (
    <div className="md:p-6 h-full pt-20 bg-gray-50">
      <div className="flex justify-between flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold">📦 Product Groups</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/product-group-form")}
        >
          <Plus size={18} /> Add Product Group
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto p-5">
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
            <tr>
              <th className="px-4 py-3">Group Name</th>
              <th className="px-4 py-3">Main Products</th>
              <th className="px-4 py-3">Addon Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  <td className="px-4 py-2">{group[0]}</td>
                  <td className="px-4 py-2">{group[1]}</td>
                  <td className="px-4 py-2">{group[2]}</td>
                  <td className="px-4 py-2">{group[3] == "TRUE" ? "Available" : "Not Available"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="border px-2 py-1 rounded-md bg-gray-300"
                      onClick={() => {
                        setEditingGroup(group);
                        setStatus(group[3]);
                        setAddonProduct(group[2]);
                        setMainProduct(group[1]);
                        setGroupName(group[0]);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="border px-2 py-1 rounded-md bg-red-500 text-white"
                      onClick={() => deleteProductGroup(group[0], setRefresh, refresh)}
                    >
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
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="max-w-4xl w-full mx-4 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Product Group</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Group Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={groupName}
                  placeholder="Enter Product Name"
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Main Products <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => navigate("/add-product")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">+ Product</button>
                  <select
                    value={mainProduct}
                    onChange={(e) => setMainProduct(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Main Product</option>
                    {items.map((item, index) => (
                      <option key={index} value={item[0]}>{item[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Addon Products</label>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => navigate("/add-product")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">+ Product</button>
                  <select
                    value={addonProduct}
                    onChange={(e) => setAddonProduct(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Addon Product</option>
                    {items.map((item, index) => (
                      <option key={index} value={item[0]}>{item[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${status == "TRUE" ? "bg-blue-500" : "bg-gray-300"}`}
                    onClick={() => setStatus(!status)}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform ${status ? "translate-x-6" : "translate-x-0"} transition`} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => { setGroupName(""); setAddonProduct(""); setMainProduct(""); setStatus(false); setDialogOpen(false); }} className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
                <button onClick={handleEditGroup} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit Group</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
