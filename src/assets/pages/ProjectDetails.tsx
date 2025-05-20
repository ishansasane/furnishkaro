import { Target } from "lucide-react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setInteriorData } from "../Redux/dataSlice";
import { setSalesAssociateData } from "../Redux/dataSlice";


const ProjectDetails = ({
  selectedCustomer,
  interior,
  salesdata,
  interiorArray,
  setInteriorArray,
  salesAssociateArray,
  setSalesAssociateArray,
  projectName,
  setProjectName,
  projectReference,
  setProjectReference,
  user,
  setUser,
  projectDate,
  setProjectDate,
  setAdditionalRequests,
  additionalRequests,
  projectAddress,
  setProjectAddress,
  setSalesData
}) => {

  async function fetchInteriors() {
    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getinteriordata", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.body;
    } catch (error) {
      console.error("Error fetching interiors:", error);
      return [];
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const [interiorData, setInterior] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    const url = "https://sheeladecor.netlify.app/.netlify/functions/server/sendinteriordata";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, phonenumber, address }),
    });

    if (response.status === 200) {
      const data = await fetchInteriors();
    
      // 1. Update Redux store
      dispatch(setInteriorData(data));
    
      // 2. Update local state
      setInterior(data);
    
      // 3. Update localStorage cache
      localStorage.setItem("interiorData", JSON.stringify({ data, time: Date.now() }));
    
      // 4. Close modal and notify
      setIsOpen(false);
      alert("Interior added successfully");
    } else {
      alert("Error saving interior");
    }
    
  };

    const [isSalesOpen, setIsSalesOpen] = useState(false);
  
    async function fetchSalesAssociates() {
      try {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getsalesassociatedata", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data.body) ? data.body : [];
      } catch (error) {
        console.error("Error fetching sales associates:", error);
        return [];
      }
    }
  
    const [salesname, salesSetName] = useState("");
    const [salesemail, salesSetEmail] = useState("");
    const [salesphonenumber, salesSetPhoneNumber] = useState("");
    const [salesaddress, salesSetAddress] = useState("");
  
    const handleSalesSubmit = async () => {
      const url = "https://sheeladecor.netlify.app/.netlify/functions/server/sendsalesassociatedata";
      const method = "POST";
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name : salesname, email : salesemail, phonenumber : salesphonenumber, address : salesaddress }),
      });
  
      if (response.status === 200) {
        const data = await fetchSalesAssociates();
      
        // 1. Update Redux store
        dispatch(setSalesAssociateData(data));
        setSalesData(data);
        // 3. Update localStorage cache
        localStorage.setItem("salesAssociateData", JSON.stringify({ data, time: Date.now() }));
      
        // 4. Close modal and notify
        setIsOpen(false);
        alert("Sales Associate added successfully");
      } else {
        alert("Error saving sales associate");
      }
      
    };

  return (
    <div className="flex flex-col gap-3 w-full rounded-xl shadow-2xl border-2 border-gray-200 px-3 py-3">
      <p className="text-[1.4vw] font-semibold">Project Details</p>

      {/* Reference & Project Name */}
      <div className="flex flex-row w-full gap-2">
        
        <div className="flex flex-col w-1/2">
          <p className="">Project Name (type a unique name)</p>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <p className="">Reference (optional)</p>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={projectReference}
            onChange={(e) => setProjectReference(e.target.value)}
            placeholder="Reference"
          />
        </div>
      </div>

      {/* Address */}
      {selectedCustomer && (
        <div className="flex flex-row w-full gap-2">
          <div className="flex flex-col w-full">
            <p className="">Address</p>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={projectAddress ? projectAddress : ""}
              onChange={(e) => setProjectAddress(e.target.value)}
              placeholder="Address"
            />
          </div>
        </div>
      )}

      {/* Additional Requests */}
      {selectedCustomer && (
        <div className="flex flex-row w-full gap-2">
          <div className="flex flex-col w-full">
            <p className="">Any Additional Requests (optional)</p>
            <input placeholder="Additional Requests" type="text" value={additionalRequests} onChange={(e) => setAdditionalRequests(e.target.value)} className="border p-2 rounded w-full" />
          </div>
        </div>
      )}

      {/* Dropdowns for Interior & Sales Associate */}
      <div className="flex flex-row w-full gap-2">
        <div className="flex flex-col w-1/2">
                    <div className="flex flex-row gap-3 px-2">
                      <p className="">Select Interior</p>
                      <button className="mb-3 flex items-center px-2 py-1 border-1 border-blue-400 text-blue-500 font-semibold !rounded-xl hover:bg-blue-50 transition" onClick={() => setIsOpen(true)}>
            <span className="mr-2 flex justify-center w-6 h-6 border-2 border-blue-500 rounded-full text-lg leading-none text-blue-600">+</span> Interior
          </button>
                    </div>
          <select
            className="border border-black p-2 rounded opacity-50 w-full"
            value={interiorArray}
            onChange={(e) => {setInteriorArray(e.target.value);}}
          >
            <option value="">Select Interior Name (optional)</option>
            {interior.map((data, index) => (
              <option key={index} value={data}>
                {data[0]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-1/2">
          <div className="flex flex-row gap-3 px-2">
            <p className="">Select Sales Associate</p>
            <button className="mb-3 flex items-center px-2 py-1 border-1 border-blue-400 text-blue-500 font-semibold !rounded-xl hover:bg-blue-50 transition" >
            <span className="mr-2 flex justify-center w-6 h-6 border-2 border-blue-500 rounded-full text-lg leading-none text-blue-600">+</span>Sales Associate
          </button>
          </div>
          <select
            className="border border-black p-2 rounded opacity-50 w-full"
            value={salesAssociateArray}
            onChange={(e) => setSalesAssociateArray(e.target.value)}
          >
            <option value="">Select Sales Associate (optional)</option>
            {salesdata.map((data, index) => (
              <option key={index} value={data}>
                {data[0]}
              </option> 
            ))}
          </select>
        </div>
      </div>

      {/* Select User */}
      <div className="flex flex-row w-full gap-2">
        <div className="flex flex-col w-1/2">
          <p className="">Select User</p>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="User Name"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <p className="">Project Deadline</p>
          <input
            type="date"
            className="border p-2 opacity-50 rounded w-full"
            value={projectDate}
            onChange={(e) => setProjectDate(e.target.value)}
          />
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-white w-[300px] p-6 rounded-xl shadow-xl text-center">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-50 w-full max-w-md">
          <div className="bg-white p-6 rounded shadow-md w-full border">
            <h2 className="text-xl font-bold mb-4">{"Add Interior"}</h2>
            <input className={` border p-2 rounded w-full mb-2`} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="border p-2 rounded w-full mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="border p-2 rounded w-full mb-2" placeholder="Phone Number" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <input className="border p-2 rounded w-full mb-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
            <div className="flex flex-row justify-between">
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ borderRadius : "6px"}}
                className="px-3 py-1 text-white bg-sky-600 hover:bg-sky-700"
              >
                Add
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
            {
        isSalesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-white p-6 rounded shadow-md w-[500px] border">
            <h2 className="text-xl font-bold mb-4">{"Add Sales Associate"}</h2>
            <input className={`border p-2 rounded w-full mb-2`} placeholder="Name" value={salesname} onChange={(e) => salesSetName(e.target.value)} />
            <input className="border p-2 rounded w-full mb-2" placeholder="Email" value={salesemail} onChange={(e) => salesSetEmail(e.target.value)} />
            <input className="border p-2 rounded w-full mb-2" placeholder="Phone Number" value={salesphonenumber} onChange={(e) => salesSetPhoneNumber(e.target.value)} />
            <input className="border p-2 rounded w-full mb-2" placeholder="Address" value={salesaddress} onChange={(e) => salesSetAddress(e.target.value)} />
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsSalesOpen(false)}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSalesSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default ProjectDetails;