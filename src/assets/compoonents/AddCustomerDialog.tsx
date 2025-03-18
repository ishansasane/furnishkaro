import { EditIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { setCustomerData } from "../Redux/dataSlice";
interface Customer {
  name: string;
  mobile: string;
  address: string;
}

interface AddCustomerDialogProps {
  setDialogOpen: (open: boolean) => void;
  setCustomers: (callback: (prev: Customer[]) => Customer[]) => void;
}

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
    return Array.isArray(data.body) ? data.body : []; // ✅ Ensure we return an array
  } catch (error) { 
    console.error("Error fetching customer data:", error);
    return [];
  }
}


const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({ setDialogOpen, editing, setEditing }) => {
  const [name, setName] = useState(editing ? editing[0] : "");
  const [mobile, setMobile] = useState(editing ? editing[1] : "");
  const [address, setAddress] = useState(editing ? editing[2] : "");

  const dispatch = useDispatch();
  const customerData = useSelector((state : RootState) => state.data.customers);

  async function sendcustomerData(){

    const phonenumber = mobile;

    if(editing){
      setName(editing[0]);
    }

    const api = editing ? "https://sheeladecor.netlify.app/.netlify/functions/server/updatecustomerdata" : "https://sheeladecor.netlify.app/.netlify/functions/server/sendcustomerdata";

    console.log(api);

    const response = await fetch(api, {
        method : "POST",
        headers : {
          "content-type" : "application/json"
        },
        credentials : "include",
        body : JSON.stringify({ name, phonenumber, address }),
      });

      if(response.status === 200){
        const data = await fetchCustomers();
        dispatch(setCustomerData(data));
        alert(editing ? "Customer Updated Successfully" : "Customer added successfully");
      }else{
        alert(editing ?"Error in updating customer" : "Error in adding customer");
      }
      setEditing(null);
      setDialogOpen(false);
  }

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-50 w-full max-w-md">
      <div className="bg-white p-6 rounded shadow-md w-full border">
        <h2 className="text-xl font-bold mb-4">{editing ? "Edit Customer" : "Add Customer"}</h2>
        <input
          className={`${editing ? "hidden" : "none"} border p-2 rounded w-full mb-2`}
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
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => {setEditing(null); setDialogOpen(false)}}>
            Cancel
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={sendcustomerData}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerDialog;
