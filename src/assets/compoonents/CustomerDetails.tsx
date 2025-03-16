import { useEffect, useState } from "react";
import AddCustomerDialog from "./AddCustomerDialog";


interface Customer {
  name: string;
  mobile: string;
  address: string;
}

interface CustomerDetailsProps {
  selectedCustomer: string | null;
  setSelectedCustomer: (customer: string | null) => void;
  customers: Customer[];
  setCustomers: (callback: (prev: Customer[]) => Customer[]) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ selectedCustomer, setSelectedCustomer, customers, setCustomers }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);


  return (
    <div className="mb-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
      <div className="flex gap-4">
        <select
          className="border p-2 rounded w-full"
          value={selectedCustomer || ""}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map((customer, index) => (
            <option key={index} value={customer.name}>
              {customer[0]}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setDialogOpen(true)}>
          + Add Customer
        </button>
      </div>

      {isDialogOpen && <AddCustomerDialog setDialogOpen={setDialogOpen} setCustomers={setCustomers} editing={editing} setEditing={setEditing}/>}
    </div>
  );
};

export default CustomerDetails;
