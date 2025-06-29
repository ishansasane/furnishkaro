import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithLoading } from "../Redux/fetchWithLoading";

interface SalesAssociateDialogProps {
  setDialogOpen: (open: boolean) => void;
  setRefresh: (state: boolean) => void;
  refresh: boolean;
  editingSalesAssociate: string[];
  setEditingSalesAssociate: (salesAssociate: null) => void;
}

const SalesAssociateDialog: React.FC<SalesAssociateDialogProps> = ({
  setDialogOpen,
  setRefresh,
  refresh,
  editingSalesAssociate,
  setEditingSalesAssociate,
}) => {
  const navigate = useNavigate();
  const data = editingSalesAssociate;
  const [name, setName] = useState(editingSalesAssociate ? data[0] : "");
  const [email, setEmail] = useState(editingSalesAssociate ? data[1] : "");
  const [phonenumber, setPhoneNumber] = useState(
    editingSalesAssociate ? data[2] : ""
  );
  const [address, setAddress] = useState(editingSalesAssociate ? data[3] : "");

  const handleSubmit = async () => {
    const url = editingSalesAssociate
      ? "https://sheeladecor.netlify.app/.netlify/functions/server/updatesalesassociatedata"
      : "https://sheeladecor.netlify.app/.netlify/functions/server/sendsalesassociatedata";
    const method = "POST";

    const response = await fetchWithLoading(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, phonenumber, address }),
    });

    if (response.status === 200) {
      alert(
        editingSalesAssociate
          ? "Sales Associate updated successfully"
          : "Sales Associate added successfully"
      );
      setRefresh(!refresh);
      setEditingSalesAssociate(null);
      setDialogOpen(false);
    } else {
      alert("Error saving sales associate");
    }
  };

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-50 w-full max-w-md">
      <div className="bg-white p-6 rounded shadow-md w-full border">
        <h2 className="text-xl font-bold mb-4">
          {editingSalesAssociate
            ? "Edit Sales Associate"
            : "Add Sales Associate"}
        </h2>
        <input
          className={`${
            editingSalesAssociate ? "hidden" : ""
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
              navigate("/masters/sales-associate");
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

export default SalesAssociateDialog;
