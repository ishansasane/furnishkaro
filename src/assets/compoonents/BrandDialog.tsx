/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BrandDialogProps {
  setDialogOpen: (state: boolean) => void;
  setRefresh: (state: boolean) => void;
  refresh: boolean;
  editingBrand: string[] | null;
  setEditingBrand: (brand: string[] | null) => void;
}

const BrandDialog: React.FC<BrandDialogProps> = ({ setDialogOpen, setRefresh, refresh, editingBrand, setEditingBrand }) => {
  const navigate = useNavigate();

  const data = editingBrand;
  const [brandName, setBrandName] = useState(editingBrand ? data[0] : "");
  const [description, setDescription] = useState(editingBrand ? data[1] : "");

  const handleSubmit = async () => {
    const url = editingBrand
      ? "https://sheeladecor.netlify.app/.netlify/functions/server/updatebrand"
      : "https://sheeladecor.netlify.app/.netlify/functions/server/addbrand";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ brandName, description }),
      });

      if (response.status === 200) {
        alert(editingBrand ? "Brand updated successfully" : "Brand added successfully");
        setDialogOpen(false); // Close the dialog
        setEditingBrand(null); // Reset editing state
        setRefresh(!refresh); // Toggle refresh to update the parent component
        navigate("/masters/brands"); // Navigate back to brands page
      } else {
        alert("Error saving brand");
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Error saving brand");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center">
      {/* White Backdrop */}
      <div className="fixed inset-0 bg-white z-40"></div>
      {/* Dialog */}
      <div className="relative top-10 w-full max-w-md z-50">
        <div className="bg-white p-6 rounded shadow-md w-full border">
          <h2 className="text-xl font-bold mb-4">{editingBrand ? "Edit Brand" : "Add Brand"}</h2>
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setDialogOpen(false);
                setEditingBrand(null);
                navigate("/masters/brands");
              }}
            >
              Cancel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDialog;