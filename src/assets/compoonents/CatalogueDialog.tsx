import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CatalogueDialogProps {
  setDialogOpen: (open: boolean) => void;
  setRefresh: (state: boolean) => void;
  refresh: boolean;
  editingCatalogue: string[] | null;
  setEditingCatalogue: (catalogue: string[] | null) => void;
}

const CatalogueDialog: React.FC<CatalogueDialogProps> = ({ setDialogOpen, setRefresh, refresh, editingCatalogue, setEditingCatalogue }) => {
  const navigate = useNavigate();
  const data = editingCatalogue;
  const [catalogueName, setCatalogueName] = useState(editingCatalogue ? data[0] : "");
  const [description, setDescription] = useState(editingCatalogue ? data[1] : "");

  const handleSubmit = async () => {
    const url = editingCatalogue
      ? "https://sheeladecor.netlify.app/.netlify/functions/server/updatecatalogue"
      : "https://sheeladecor.netlify.app/.netlify/functions/server/addcatalogue";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ catalogueName, description }),
    });

    if (response.status === 200) {
      alert(editingCatalogue ? "Catalogue updated successfully" : "Catalogue added successfully");
      setRefresh(!refresh);
      setEditingCatalogue(null);
      setDialogOpen(false);
    } else {
      alert("Error saving catalogue");
    }
  };

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-50 w-full max-w-md">
      <div className="bg-white p-6 rounded shadow-md w-full border">
        <h2 className="text-xl font-bold mb-4">{editingCatalogue ? "Edit Catalogue" : "Add Catalogue"}</h2>
        <input
          className={`${editingCatalogue ? "hidden" : "border"} p-2 rounded w-full mb-2`}
          placeholder="Catalogue Name"
          value={catalogueName}
          onChange={(e) => setCatalogueName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
         <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => navigate(-1)}>
            Cancel
    </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueDialog;
