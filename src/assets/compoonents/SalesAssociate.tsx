
import { useState, useEffect } from "react";
import { Plus, Pencil, XCircle } from "lucide-react";
import SalesAssociateDialog from "../compoonents/SalesAssociateDialog";
import { RootState } from "../Redux/Store";
import { useSelector, useDispatch } from "react-redux";
import { setSalesAssociateData } from "../Redux/dataSlice";
import { useNavigate } from "react-router-dom";

interface SalesAssociate {
  data: string[];
}

// Fetch Sales Associates
async function fetchSalesAssociates(): Promise<SalesAssociate[]> {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getsalesassociatedata", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching sales associates:", error);
    return [];
  }
}

// Delete a Sales Associate
async function deleteSalesAssociate(name: string, setRefresh: (state: boolean) => void, dispatch: any, setSalesAssociates: (salesAssociates: SalesAssociate[]) => void) {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletesalesassociatedata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      alert("Sales Associate deleted");
      const updatedSalesAssociates = await fetchSalesAssociates();
      dispatch(setSalesAssociateData(updatedSalesAssociates));
      setSalesAssociates(updatedSalesAssociates);
      localStorage.setItem("salesAssociateData", JSON.stringify({ data: updatedSalesAssociates, time: Date.now() }));
      setRefresh(true);
    } else {
      const errorText = await response.text();
      alert(`Error deleting sales associate: ${errorText || response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting sales associate:", error);
    alert("Network or server error while deleting sales associate");
  }
}

export default function SalesAssociates() {
  const navigate = useNavigate();
  const [salesAssociates, setSalesAssociates] = useState<SalesAssociate[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingSalesAssociate, setEditingSalesAssociate] = useState<SalesAssociate | null>(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const salesAssociatesFromRedux = useSelector((state: RootState) => state.data.salesAssociates);

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const cached = localStorage.getItem("salesAssociateData");
        const now = Date.now();
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes

        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.data?.length > 0 && now - parsed.time < cacheExpiry) {
            dispatch(setSalesAssociateData(parsed.data));
            setSalesAssociates(parsed.data);
            return;
          }
        }

        const data = await fetchSalesAssociates();
        if (Array.isArray(data)) {
          dispatch(setSalesAssociateData(data));
          setSalesAssociates(data);
          localStorage.setItem("salesAssociateData", JSON.stringify({ data, time: now }));
        } else {
          console.error("Fetched sales associate data is invalid:", data);
        }
      } catch (error) {
        console.error("Error fetching sales associates:", error);
      }
    };

    fetchAndSetData();
    setRefresh(false);
  }, [dispatch, refresh]); // Removed salesAssociatesFromRedux from dependencies

  // Filter sales associates based on search input
  const filteredSalesAssociates = salesAssociates.filter((salesAssociate) =>
    [salesAssociate[0], salesAssociate[1], salesAssociate[2], salesAssociate[3]]
      .map((field) => (field || "").toString().toLowerCase())
      .some((field) => field.includes(search.toLowerCase()))
  );

  return (
    <div className="md:p-6 pt-20 h-full bg-gray-50">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Associates</h1>
        <button
          className="flex !rounded-md items-center gap-2 bg-blue-600 text-white px-4 py-2"
          onClick={() => navigate("/sales-associate-dialog")}
        >
          <Plus size={18} /> Add Sales Associate
        </button>
      </div>
      <div className="bg-white overflow-x-auto shadow rounded-lg p-5">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search sales associates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full"
          />
        </div>
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
            {filteredSalesAssociates.length > 0 ? (
              filteredSalesAssociates.map((salesAssociate, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  <td className="px-4 py-2">{salesAssociate[0]}</td>
                  <td className="px-4 py-2">{salesAssociate[1]}</td>
                  <td className="px-4 py-2">{salesAssociate[2]}</td>
                  <td className="px-4 py-2">{salesAssociate[3]}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="border px-2 py-1 rounded-md"
                      onClick={() => {
                        setEditingSalesAssociate(salesAssociate);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="border px-2 py-1 rounded-md"
                      onClick={() => deleteSalesAssociate(salesAssociate[0], setRefresh, dispatch, setSalesAssociates)}
                    >
                      <XCircle size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">No sales associates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isDialogOpen && <SalesAssociateDialog setDialogOpen={setDialogOpen} setRefresh={setRefresh} refresh={refresh} editingSalesAssociate={editingSalesAssociate} setEditingSalesAssociate={setEditingSalesAssociate} />}
    </div>
  );
}
