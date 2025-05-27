import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import TailorDialog from "../compoonents/TailorDialog";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setTailorData } from "../Redux/dataSlice";
import { useNavigate } from "react-router-dom";
  


// Fetch Tailors
async function fetchTailors(){
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettailors", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching tailors:", error);
    return [];
  }
}

// Delete a Tailor
async function deleteTailor(tailorName: string, setRefresh: (state: boolean) => void, refresh: boolean) {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetailor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tailorName }),
  });

  if (response.status === 200) {
    alert("Tailor deleted");
    setRefresh(!refresh);
  } else {
    alert("Error deleting tailor");
  }
}

export default function Tailors() {
  const navigate = useNavigate();
  const [tailors, setTailors] = useState([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingTailor, setEditingTailor] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const tailorData = useSelector((state : RootState) => state.data.tailors);

  useEffect(() => {
    async function getTailors() {
      const data = await fetchTailors();
      dispatch(setTailorData(data));
      setTailors(tailorData);
    }
    if(tailorData.length == 0){
      getTailors();
    }else{
      setTailors(tailorData);
    }
  }, [dispatch, tailorData]);

  useEffect(() => {
    async function getTailors() {
      const data = await fetchTailors();
      dispatch(setTailorData(data));
      setTailors(tailorData);
    }
    if(refresh){
      getTailors();
      setRefresh(false);
    }
  }, [refresh])

  return (
    <div className="md:p-6 pt-20  h-full bg-gray-50">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tailors</h1>
        <button className="flex !rounded-lg items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => navigate("/tailor-dialog")}>
          <Plus size={18} /> Add Tailor
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tailors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>
      <div className="bg-white shadow overflow-x-auto rounded-lg p-5">
      <table className="w-full">
        <thead className="bg-sky-50">
          <tr>
            <th className="px-4 py-3">Tailor Name</th>
            <th className="px-4 py-3">Phone Number</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tailors.length > 0 ? (
            tailors.map((tailor, index) => (
              <tr key={index} className="hover:bg-sky-50">
                <td className="px-4 py-2">{tailor[0]}</td>
                <td className="px-4 py-2">{tailor[1]}</td>
                <td className="px-4 py-2">{tailor[2]}</td>
                <td className="px-4 py-2">{tailor[3]}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="border px-2 py-1 rounded-md bg-gray-300" onClick={() => { setEditingTailor(tailor); setDialogOpen(true); }}>
                    <Edit size={16} />
                  </button>
                  <button className="border px-2 py-1 rounded-md bg-red-500 text-white" onClick={() => deleteTailor(tailor[0], setRefresh, refresh)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">No tailors found.</td>
            </tr>
          )}
        </tbody>
      </table>
</div>
      {isDialogOpen && <TailorDialog setDialogOpen={setDialogOpen} setRefresh={setRefresh} refresh={refresh} editingTailor={editingTailor} setEditingTailor={setEditingTailor} />}
    </div>
  );
}
