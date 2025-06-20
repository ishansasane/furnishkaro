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

const BrandDialog: React.FC<BrandDialogProps> = ({ setDialogOpen , setRefresh, refresh, editingBrand, setEditingBrand }) => {
  const navigate = useNavigate();

  const data = editingBrand;
  const [brandName, setBrandName] = useState(editingBrand ? data[0] : "");
  const [description, setDescription] = useState(editingBrand ? data[1] : "");

  const handleSubmit = async () => {

    
    const url = editingBrand
      ? "https://sheeladecor.netlify.app/.netlify/functions/server/updatebrand"
      : "https://sheeladecor.netlify.app/.netlify/functions/server/addbrand";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ brandName, description }),
    });

    if (response.status === 200) {
      alert(editingBrand ? "Brand updated successfully" : "Brand added successfully");
    } else {
      alert("Error saving brand");
    }
    setDialogOpen(false);
    setEditingBrand(null);
    if(refresh){
      setRefresh(false);
    }else{
      setRefresh(true);
    }
  };

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-50 w-full max-w-md">
      <div className="bg-white p-6 rounded shadow-md w-full border">
        <h2 className="text-xl font-bold mb-4">{editingBrand ? "Edit Brand" : "Add Brand"}</h2>
        <input
          className={`border p-2 rounded w-full mb-2`}
          placeholder="Brand Name"
          value={brandName}
          onChange={(e) => {editingBrand ? null : setBrandName(e.target.value)}}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => {navigate("/masters/brands"); setDialogOpen(false); }}>
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

export default BrandDialog;
