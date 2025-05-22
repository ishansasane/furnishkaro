import { Target } from "lucide-react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setInteriorData, setSalesAssociateData } from "../Redux/dataSlice";

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
  setSalesData,
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
      dispatch(setInteriorData(data));
      setInterior(data);
      localStorage.setItem("interiorData", JSON.stringify({ data, time: Date.now() }));
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
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: salesname, email: salesemail, phonenumber: salesphonenumber, address: salesaddress }),
    });

    if (response.status === 200) {
      const data = await fetchSalesAssociates();
      dispatch(setSalesAssociateData(data));
      setSalesData(data);
      localStorage.setItem("salesAssociateData", JSON.stringify({ data, time: Date.now() }));
      setIsSalesOpen(false); // Fixed: Close sales modal
      alert("Sales Associate added successfully");
    } else {
      alert("Error saving sales associate");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full rounded-xl shadow-2xl border-2 border-gray-200 p-4 sm:p-6">
      <p className="font-semibold text-lg sm:text-xl">Project Details</p>

      {/* Reference & Project Name */}
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <div className="flex flex-col w-full sm:w-1/2">
          <p className="text-sm sm:text-base">Project Name (type a unique name)</p>
          <input
            type="text"
            className="border p-2 rounded w-full text-sm sm:text-base"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
          />
        </div>
        <div className="flex flex-col w-full sm:w-1/2">
          <p className="text-sm sm:text-base">Reference (optional)</p>
          <input
            type="text"
            className="border p-2 rounded w-full text-sm sm:text-base"
            value={projectReference}
            onChange={(e) => setProjectReference(e.target.value)}
            placeholder="Reference"
          />
        </div>
      </div>

      {/* Address */}
      {selectedCustomer && (
        <div className="flex flex-col w-full">
          <p className="text-sm sm:text-base">Address</p>
          <input
            type="text"
            className="border p-2 rounded w-full text-sm sm:text-base"
            value={projectAddress || ""}
            onChange={(e) => setProjectAddress(e.target.value)}
            placeholder="Address"
          />
        </div>
      )}

      {/* Additional Requests */}
      {selectedCustomer && (
        <div className="flex flex-col w-full">
          <p className="text-sm sm:text-base">Any Additional Requests (optional)</p>
          <input
            placeholder="Additional Requests"
            type="text"
            value={additionalRequests}
            onChange={(e) => setAdditionalRequests(e.target.value)}
            className="border p-2 rounded w-full text-sm sm:text-base"
          />
        </div>
      )}

      {/* Dropdowns for Interior & Sales Associate */}
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <div className="flex flex-col w-full sm:w-1/2">
          <div className="flex flex-row justify-between items-center mb-2">
            <p className="text-sm sm:text-base">Select Interior</p>
            <button
              className="flex items-center px-3 py-1.5 border border-blue-400 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition text-sm"
              onClick={() => setIsOpen(true)}
            >
              <FaPlus className="mr-2" /> Add Interior
            </button>
          </div>
          <select
            className="border border-gray-300 p-2 rounded w-full text-sm sm:text-base"
            value={interiorArray}
            onChange={(e) => setInteriorArray(e.target.value)}
          >
            <option value="">Select Interior Name (optional)</option>
            {interior.map((data, index) => (
              <option key={index} value={data}>
                {data[0]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full sm:w-1/2">
          <div className="flex flex-row justify-between items-center mb-2">
            <p className="text-sm sm:text-base">Select Sales Associate</p>
            <button
              className="flex items-center px-3 py-1.5 border border-blue-400 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition text-sm"
              onClick={() => setIsSalesOpen(true)}
            >
              <FaPlus className="mr-2" /> Add Sales Associate
            </button>
          </div>
          <select
            className="border border-gray-300 p-2 rounded w-full text-sm sm:text-base"
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

      {/* Select User & Project Date */}
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <div className="flex flex-col w-full sm:w-1/2">
          <p className="text-sm sm:text-base">Select User</p>
          <input
            type="text"
            className="border p-2 rounded w-full text-sm sm:text-base"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="User Name"
          />
        </div>
        <div className="flex flex-col w-full sm:w-1/2">
          <p className="text-sm sm:text-base">Project Date</p>
          <input
            type="date"
            className="border p-2 rounded w-full text-sm sm:text-base"
            value={projectDate}
            onChange={(e) => setProjectDate(e.target.value)}
          />
        </div>
      </div>

      {/* Interior Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Add Interior</h2>
            <input
              className="border p-2 rounded w-full mb-3 text-sm sm:text-base"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full mb-3 text-sm sm:text-base"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full mb-3 text-sm sm:text-base"
              placeholder="Phone Number"
              value={phonenumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full mb-3 text-sm sm:text-base"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Associate Modal */}
      {isSalesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Add Sales Associate</h2>
            <input
              className="border p-2 rounded w-full mb-3 text-sm sm:text-base"
              placeholder="Name"
              value={salesname}
              onChange={(e) => salesSetName(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full mb-3 text-sm sm:text-base"
              placeholder="Email"
              value={salesemail}
              onChange={(e) => salesSetEmail(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full mb-3 text-sm sm:text-base"
              placeholder="Phone Number"
              value={salesphonenumber}
              onChange={(e) => salesSetPhoneNumber(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full mb-3 text-sm sm:text-base"
              placeholder="Address"
              value={salesaddress}
              onChange={(e) => salesSetAddress(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
                onClick={() => setIsSalesOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                onClick={handleSalesSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;