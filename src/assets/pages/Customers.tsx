import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddCustomerDialog from "../compoonents/AddCustomerDialog";


interface Customer {
  name: string;
  mobile: string;
  address: string;
}

// Sample customers data
const customersData: Customer[] = [
  { name: "John Doe", mobile: "9876543210", address: "123 Street, NY" },
  { name: "Jane Smith", mobile: "9123456789", address: "456 Avenue, CA" },
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header with Add Customer Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">👥 Customers</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => setDialogOpen(true)}
        >
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      {/* Customer Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Mobile</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{customer.name}</td>
                <td className="border px-4 py-2">{customer.mobile}</td>
                <td className="border px-4 py-2">{customer.address}</td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2">
                    <button className="border px-2 py-1 rounded-md bg-gray-300">
                      <Edit size={16} />
                    </button>
                    <button
                      className="border px-2 py-1 rounded-md bg-red-500 text-white"
                      onClick={() =>
                        setCustomers((prev) =>
                          prev.filter((c) => c.mobile !== customer.mobile)
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Customer Dialog */}
      {isDialogOpen && (
        <AddCustomerDialog setDialogOpen={setDialogOpen} setCustomers={setCustomers} />
      )}
    </div>
  );
}
