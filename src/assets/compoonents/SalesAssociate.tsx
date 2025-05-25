import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import SalesAssociateDialog from "../compoonents/SalesAssociateDialog";
import { RootState } from "../Redux/Store";
import { useSelector, useDispatch } from "react-redux";
import { setSalesAssociateData } from "../Redux/dataSlice";
import { useNavigate } from "react-router-dom";

// Fetch Sales Associates
async function fetchSalesAssociates() {
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
async function deleteSalesAssociate(name: string, setRefresh: (state: boolean) => void, refresh: boolean) {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletesalesassociatedata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (response.status === 200) {
    alert("Sales Associate deleted");
    setRefresh(!refresh);
  } else {
    alert("Error deleting sales associate");
  }
}

export default function SalesAssociates() {
  const navigate = useNavigate();
  const [salesAssociates, setSalesAssociates] = useState([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingSalesAssociate, setEditingSalesAssociate] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const salesAssociateData = useSelector((state: RootState) => state.data.salesAssociates);

  useEffect(() => {
    async function getSalesAssociates() {
      const data = await fetchSalesAssociates();
      dispatch(setSalesAssociateData(data));
      setSalesAssociates(data);
    }
    if (salesAssociateData.length === 0) {
      getSalesAssociates();
    } else {
      setSalesAssociates(salesAssociateData);
    }
  }, [dispatch, salesAssociateData]);

  useEffect(() => {
    async function getSalesAssociates() {
      const data = await fetchSalesAssociates();
      dispatch(setSalesAssociateData(data));
      setSalesAssociates(data);
    }
    if (refresh) {
      getSalesAssociates();
      setRefresh(false);
    }
  }, [refresh]);

  // Filter by Name (index 0)
  const filteredAssociates = salesAssociates.filter((sa) =>
    sa[0]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="md:p-6 pt-20 h-full bg-gray-50">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🛒 Sales Associates</h1>
        <button
          className="flex !rounded-lg items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/sales-associateDialog")}
        >
          <Plus size={18} /> Add Sales Associate
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search sales associates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      <div className="bg-white overflow-x-auto shadow rounded-lg p-5">
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
            {filteredAssociates.length > 0 ? (
              filteredAssociates.map((sa, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  <td className="px-4 py-2">{sa[0]}</td>
                  <td className="px-4 py-2">{sa[1]}</td>
                  <td className="px-4 py-2">{sa[2]}</td>
                  <td className="px-4 py-2">{sa[3]}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="border px-2 py-1 rounded-md bg-gray-300"
                      onClick={() => {
                        setEditingSalesAssociate(sa);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="border px-2 py-1 rounded-md bg-red-500 text-white"
                      onClick={() => deleteSalesAssociate(sa[0], setRefresh, refresh)}
                    >
                      <Trash2 size={16} />
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

      {isDialogOpen && (
        <SalesAssociateDialog
          setDialogOpen={setDialogOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          editingSalesAssociate={editingSalesAssociate}
          setEditingSalesAssociate={setEditingSalesAssociate}
        />
      )}
    </div>
  );
}
