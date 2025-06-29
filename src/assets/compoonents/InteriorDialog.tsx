import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithLoading } from "../Redux/fetchWithLoading";

interface InteriorDialogProps {
  setDialogOpen: (open: boolean) => void;
  setRefresh: (state: boolean) => void;
  refresh: boolean;
  editingInterior: string[] | null;
  setEditingInterior: (interior: string[] | null) => void;
}

const InteriorDialog: React.FC<InteriorDialogProps> = ({
  setDialogOpen,
  setRefresh,
  refresh,
  editingInterior,
  setEditingInterior,
}) => {
  const navigate = useNavigate();
  const data = editingInterior;
  const [name, setName] = useState(editingInterior ? data[0] : "");
  const [email, setEmail] = useState(editingInterior ? data[1] : "");
  const [phonenumber, setPhoneNumber] = useState(
    editingInterior ? data[2] : ""
  );
  const [address, setAddress] = useState(editingInterior ? data[3] : "");

  const handleSubmit = async () => {
    const url = editingInterior
      ? "https://sheeladecor.netlify.app/.netlify/functions/server/updateinteriordata"
      : "https://sheeladecor.netlify.app/.netlify/functions/server/sendinteriordata";

    const response = await fetchWithLoading(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, phonenumber, address }),
    });

    if (response.status === 200) {
      alert(
        editingInterior
          ? "Interior updated successfully"
          : "Interior added successfully"
      );
      setRefresh(!refresh);
      setEditingInterior(null);
      setDialogOpen(false);
    } else {
      alert("Error saving interior");
    }
  };

  return (
    <div className="absolute  top-0 left-1/2 transform -translate-x-1/2 mt-10 z-50 w-full max-w-md">
      <div className="bg-white  p-6 rounded shadow-md w-full border">
        <h2 className="text-xl font-bold mb-4">
          {editingInterior ? "Edit Interior" : "Add Interior"}
        </h2>
        <input
          className={`${
            editingInterior ? "hidden" : "none"
          } border p-2 rounded w-full mb-2`}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Phone Number"
          value={phonenumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              navigate("/masters/interiors");
              setDialogOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteriorDialog;
