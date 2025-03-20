import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddCustomerDialog from "../compoonents/AddCustomerDialog";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerData } from "../Redux/dataSlice";
interface Customer {
  name: string;
  phonenumber: string;
  address: string;
}

// Fetch customers correctly
async function fetchCustomers(){
  try {
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getcustomerdata",
      { credentials: "include" }
    );


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // ✅ Ensure JSON is properly parsed
    return Array.isArray(data.body) ? data : []; // ✅ Ensure we return an array
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

  const dispatch = useDispatch();
  const customerData = useSelector((state : RootState) => state.data.customers);

  async function deleteCustomer(name, setreset, reset){
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletecustomerdata", {
      method : "POST",
      headers : {
        "content-type" : "application/json",
      },
      credentials : "include",
      body : JSON.stringify({name}),
  
    });
  
    if(response.status === 200){
      alert("Customer deleted");
      if(reset){
        setreset(false);
      }else{
        setreset(true);
      }
    }else{
      alert("Error in customer deletion");
    }
  }

  // Fetch customers when the component mounts
  useEffect(() => {
    async function getCustomers() {
      const data = await fetchCustomers();
      dispatch(setCustomerData(data.body));
      setCustomers(customerData); // ✅ Ensure it's always an array
    }
    if(customerData.length == 0){
      getCustomers();
    }else{
      setCustomers(customerData);
    }
  }, [customerData, dispatch]);

  useEffect(() => {
    async function getCustomers() {
      const data = await fetchCustomers();
      dispatch(setCustomerData(data.body));
      setCustomers(customerData); // ✅ Ensure it's always an array
    }
    if(isDialogOpen || reset){
      getCustomers();
      setDialogOpen(false);
      setreset(false);
    }
  }, [reset])


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
            <th className="border px-4 py-2">Edit</th>
            <th className="border px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{customer[0]}</td>
                <td className="border px-4 py-2">{customer[1]}</td>
                <td className="border px-4 py-2">{customer[2]}</td>
                <td className="border px-4 py-2">
                <button className="border px-2 py-1 rounded-md bg-gray-300" onClick={() => {setEditing(customer); setDialogOpen(true)}}>
                      <Edit size={16} />
                </button>
                </td>
                <td className="border px-4 py-2">
                    <button
                      className={`border px-2 py-1 rounded-md bg-red-500 text-white`}
                      onClick={() => {deleteCustomer(customer[0], setreset, reset)}}
                    >
                    <Trash2 size={16} />
                    </button></td>
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
        <AddCustomerDialog setDialogOpen={setDialogOpen} editing={editing} setEditing = {setEditing}/>
      )}
    </div>
  );
}
