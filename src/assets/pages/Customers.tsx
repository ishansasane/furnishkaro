import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react";

import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerData } from "../Redux/dataSlice";
import AddCustomerDialog from "../compoonents/AddCustomerDialog";
import { useNavigate } from "react-router-dom";

interface Customer {
  name: string;
  phonenumber: string;
  alternateNumber: string;
  email: string;
  address: string;
  addedDate: string;
}


async function fetchCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getcustomerdata",
      { credentials: "include" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return [];
  }
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [reset, setreset] = useState(false);
  const [editing, setEditing] = useState(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null); 
  const navigate = useNavigate();

  let count = 0;

  const dispatch = useDispatch();
  const customerData = useSelector((state: RootState) => state.data.customers);

  async function deleteCustomer(name) {
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/deletecustomerdata",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name }),
      }
    );

    if (response.status === 200) {
      const data = await fetchCustomers();
      dispatch(setCustomerData(data));
      alert("Customer deleted");
      setreset(!reset);
    } else {
      alert("Error in customer deletion");
    }
  }

  useEffect(() => {
    async function getCustomers() {
      const data = await fetchCustomers();
      dispatch(setCustomerData(data));
      setCustomers(customerData);
      count = 0;
    }
    if(customerData.length == 0 && count <= 2){
      getCustomers();
      count++;
    }else{
      setCustomers(customerData);
    }
  }, [customerData, dispatch]);

  useEffect(() => {
    async function getCustomers() {
      const data = await fetchCustomers();
      dispatch(setCustomerData(data));
      setCustomers(customerData); // ✅ Ensure it's always an array
    }
    if(isDialogOpen || reset){
      getCustomers();
      setDialogOpen(false);
      setreset(false);
    }
  }, [reset, editing])

  return (
    <div className="p-6 bg-gray-50 md:mt-0 mt-20 h-screen">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">👥 Customers</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2" style={{ borderRadius : "8px" }} onClick={() => navigate("/add-customer")} ><Plus size={18} /> Add Customer</button>
      </div>

<div className="bg-white p-5 rounded-md shadow overflow-x-auto">
      <div className="mb-4 ">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-sky-50">
          <tr className="text-gray-600">
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Mobile</th>
            <th className="px-4 py-2">Alternate Number</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-6 py-2 w-1/5">Address</th>
            <th className="px-4 py-2">Added Date</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr key={index} className="hover:bg-sky-50">
                <td className="px-4 py-2">{customer[0]}</td>
                <td className="px-4 py-2">{customer[1]}</td>
                <td className="px-6 py-2">{customer[4]}</td>
                <td className="px-4 py-2">{customer[2]}</td>
                <td className="px-4 py-2">{customer[3]}</td>
                <td className="px-4 py-2">{customer[5]}</td>
                <td className="px-4 py-2 relative">
              {/* Three Dots Menu */}
              <button
                className="p-2 hover:bg-gray-200 rounded-full"
                onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
              >
                <MoreVertical size={18} />
              </button>

              {/* Dropdown Menu */}
              {openDropdown === index && (
                <div className="absolute bg-white shadow-md rounded-md z-[50] border flex flex-col">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => {
                        setEditing(customer);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit size={16} /> edit
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2"
                      onClick={() => deleteCustomer(customer[0])}
                    >
                      <Trash2 size={16} /> delete
                    </button>
                </div>
              )}
            </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      {isDialogOpen && (
        <AddCustomerDialog
          setDialogOpen={setDialogOpen}
          editing={editing}
          setEditing={setEditing}
        />
      )}
    </div>
  );
}
