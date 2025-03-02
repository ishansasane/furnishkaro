import { useState } from "react";

interface Customer {
  name: string;
  mobile: string;
  address: string;
}

interface AddCustomerDialogProps {
  setDialogOpen: (open: boolean) => void;
  setCustomers: (callback: (prev: Customer[]) => Customer[]) => void;
}

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({ setDialogOpen, setCustomers }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !mobile.trim() || !address.trim()) {
      alert("All fields are required!");
      return;
    }
    setCustomers((prev) => [...prev, { name, mobile, address }]);
    setDialogOpen(false);
  };

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-50 w-full max-w-md">
      <div className="bg-white p-6 rounded shadow-md w-full border">
        <h2 className="text-xl font-bold mb-4">Add Customer</h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setDialogOpen(false)}>
            Cancel
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerDialog;
