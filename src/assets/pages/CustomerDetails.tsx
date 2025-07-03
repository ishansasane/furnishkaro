<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" />

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddCustomerDialog from "../compoonents/AddCustomerDialog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/store";
import { setCustomerData } from "../Redux/dataSlice";
import { fetchWithLoading } from "../Redux/fetchWithLoading";

const CustomerDetails = ({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  projectData,
  setCustomers,
}) => {
  const handleCustomerChange = (e) => {
    if (e.target.value === "") {
      setSelectedCustomer(null);
    } else {
      const customerObj = JSON.parse(e.target.value);
      setSelectedCustomer(customerObj);
      projectData[0] = e.target.value;
    }
  };

  async function fetchCustomers() {
    try {
      const response = await fetchWithLoading(
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

  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [alternateNumber, setAlternateNumber] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const customerData = useSelector((state: RootState) => state.data.customers);

  async function sendcustomerData() {
    const phonenumber = mobile;
    let date = undefined;

    const now = new Date();
    date = now.toISOString().slice(0, 16);

    const api =
      "https://sheeladecor.netlify.app/.netlify/functions/server/sendcustomerdata";

    const response = await fetchWithLoading(api, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        phonenumber,
        email,
        address,
        alternatenumber: alternateNumber,
        addedDate: date,
      }),
    });

    if (response.status === 200) {
      const data = await fetchCustomers();

      // 1. Update Redux store
      dispatch(setCustomerData(data));

      // 2. Update local component state
      setCustomers(data);

      // 3. Update localStorage cache
      localStorage.setItem(
        "customerData",
        JSON.stringify({ data, time: Date.now() })
      );

      // 4. Clear form
      setName("");
      setAddress("");
      setMobile("");
      setEmail("");
      setAlternateNumber("");

      // 5. Show success
      alert("Customer added successfully");
    } else {
      alert("Error in adding customer");
    }

    setIsOpen(false);
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-white !rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl font-inter">
      <h2 className="text-2xl md:text-3xl font-poppins font-semibold text-gray-900 tracking-tight mb-4">
        Customer Details
      </h2>

      <div className="flex md:flex-row flex-col justify-between gap-4">
        {/* Select Customer */}
        <div className="flex flex-col md:w-1/2 w-full">
          <div className="flex flex-wrap flex-row gap-4 items-center mb-3">
            <label className="text-sm font-poppins font-medium text-gray-700">Select Customer</label>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-poppins font-medium !rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              onClick={() => setIsOpen(true)}
            >
              <FaPlus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
          <select
            className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter bg-gray-50"
            value={selectedCustomer ? JSON.stringify(selectedCustomer) : ""}
            onChange={handleCustomerChange}
          >
            <option value="" className="text-gray-500">
              Select Customer
            </option>
            {Array.isArray(customers) &&
              customers.map((customer, index) => (
                <option key={index} value={JSON.stringify(customer)} className="font-inter">
                  {customer[0]}
                </option>
              ))}
          </select>
        </div>

        {/* Email Field */}
        {selectedCustomer && (
          <div className="flex flex-col md:w-1/2 w-full">
            <label className="text-sm font-poppins font-medium text-gray-700 mb-1">Email (optional)</label>
            <input
              type="text"
              className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600 font-inter"
              value={selectedCustomer[2]}
              readOnly
            />
          </div>
        )}
      </div>

      {/* Phone and Alternate Phone */}
      {selectedCustomer && (
        <div className="flex md:flex-row flex-col justify-between gap-4">
          <div className="flex flex-col md:w-1/2 w-full">
            <label className="text-sm font-poppins font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600 font-inter"
              value={selectedCustomer[1]}
              readOnly
            />
          </div>
          <div className="flex flex-col md:w-1/2 w-full">
            <label className="text-sm font-poppins font-medium text-gray-700 mb-1">Alternate Phone Number (optional)</label>
            <input
              type="text"
              className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600 font-inter"
              value={selectedCustomer[4]}
              readOnly
            />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60">
          <div className="bg-white w-full max-w-md p-8 !rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300">
            <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-6 tracking-tight">Add Customer</h2>
            <div className="space-y-4">
              <input
                className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter bg-gray-50"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter bg-gray-50"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter bg-gray-50"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <input
                className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter bg-gray-50"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter bg-gray-50"
                placeholder="Alternate Number"
                value={alternateNumber}
                onChange={(e) => setAlternateNumber(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2.5 bg-gray-600 text-white text-sm font-poppins font-medium !rounded-lg hover:bg-gray-700 transition-colors duration-200"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-poppins font-medium !rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                onClick={sendcustomerData}
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

export default CustomerDetails;