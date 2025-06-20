import { useState, useEffect } from "react";
import { Plus, Pencil, XCircle } from "lucide-react";
import BrandDialog from "../compoonents/BrandDialog";
import { useDispatch, useSelector } from "react-redux";
import { setBrandData } from "../Redux/dataSlice";
import { RootState } from "../Redux/Store";
import { useNavigate } from "react-router-dom";

// Fetch brands from the server
async function fetchBrands() {
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
async function deleteBrand(brandName: string, setRefresh: (state: boolean) => void) {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletebrand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ brandName }),
    });

    if (response.ok) {
      alert("Brand deleted");
      setRefresh(true); // Trigger refresh to fetch updated data
    } else {
      const errorText = await response.text();
      alert(`Error deleting brand: ${errorText || response.statusText}`);
    }
  } catch (error) {
    alert("Network or server error while deleting brand");
    console.error("Delete brand error:", error);
  }
}

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const brandData = useSelector((state: RootState) => state.data.brands);

  useEffect(() => {
    const fetchAndSetBrands = async () => {
      try {
        const cached = localStorage.getItem("brandData");
        const now = Date.now();
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes

        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.data?.length > 0 && now - parsed.time < cacheExpiry) {
            dispatch(setBrandData(parsed.data));
            setBrands(parsed.data);
            return;
          }
        }

        const data = await fetchBrands();
        if (Array.isArray(data)) {
          dispatch(setBrandData(data));
          setBrands(data);
          localStorage.setItem("brandData", JSON.stringify({ data, time: now }));
        } else {
          console.error("Fetched brand data is invalid:", data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    if (refresh || !brandData || brandData.length === 0) {
      fetchAndSetBrands();
      setRefresh(false);
    } else {
      setBrands(brandData);
    }
  }, [brandData, dispatch, refresh]);

  return (
    <div className="md:p-6 pt-20 h-full bg-gray-50">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Brands</h1>
        <button className="flex !rounded-lg items-center gap-2 bg-blue-600 text-white px-4 py-2" onClick={() => navigate("/brand-dilog")}>
          <Plus size={18} /> Add Brand
        </button>
      </div>
      <div className="bg-white overflow-x-auto shadow rounded-lg p-5">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full"
          />
        </div>

        <table className="w-full">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-3">Brand Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((brand, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  <td className="px-4 py-2">{brand[0]}</td>
                  <td className="px-4 py-2">{brand[1]}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="border px-2 py-1 rounded-md"
                      onClick={() => {
                        setEditingBrand(brand);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="border px-2 py-1 rounded-md"
                      onClick={() => deleteBrand(brand[0], setRefresh)}
                    >
                      <XCircle size={16} />
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
      </div>
     {isDialogOpen && (
        <BrandDialog
          setDialogOpen={setDialogOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          editingBrand={editingBrand}
          setEditingBrand={setEditingBrand}
        />
      )}

    </div>
  );
}