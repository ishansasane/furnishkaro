import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import SalesAssociateDialog from "../compoonents/SalesAssociateDialog";
import { RootState } from "../Redux/Store";
import { useSelector, useDispatch } from "react-redux";
import { setSalesAssociates } from "../Redux/dataSlice";

interface SalesAssociate {
  name: string;
  email: string;
  phonenumber: string;
  address: string;
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
  const [salesAssociates, setSalesAssociates] = useState<SalesAssociate[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingSalesAssociate, setEditingSalesAssociate] = useState<SalesAssociate | null>(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const salesAssociateData = useSelector((state : RootState) => state.data.salesAssociates);

  useEffect(() => {
    async function getSalesAssociates() {
      setSalesAssociates(salesAssociateData);
    }
    getSalesAssociates();
  }, [refresh]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🛒 Sales Associates</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => setDialogOpen(true)}>
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

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesAssociates.length > 0 ? (
            salesAssociates.map((salesAssociate, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{salesAssociate[0]}</td>
                <td className="border px-4 py-2">{salesAssociate[1]}</td>
                <td className="border px-4 py-2">{salesAssociate[2]}</td>
                <td className="border px-4 py-2">{salesAssociate[3]}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button className="border px-2 py-1 rounded-md bg-gray-300" onClick={() => { setEditingSalesAssociate(salesAssociate); setDialogOpen(true); }}>
                    <Edit size={16} />
                  </button>
                  <button className="border px-2 py-1 rounded-md bg-red-500 text-white" onClick={() => deleteSalesAssociate(salesAssociate[0], setRefresh, refresh)}>
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

      {isDialogOpen && <SalesAssociateDialog setDialogOpen={setDialogOpen} setRefresh={setRefresh} refresh={refresh} editingSalesAssociate={editingSalesAssociate} setEditingSalesAssociate={setEditingSalesAssociate} />}
    </div>
  );
}
