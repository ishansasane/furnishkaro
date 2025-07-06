import React, { useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { setCustomerData } from "../../Redux/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

const EditCustomerDetails = ({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  projectData,
  setCustomers,
}) => {
  const handleCustomerChange = (customerObj) => {
    if (!customerObj) {
      setSelectedCustomer(null);
      setSearchTerm("");
    } else {
      setSelectedCustomer(customerObj);
      setSearchTerm(customerObj[0]);
    }
  };

  useEffect(() => {
    console.log(selectedCustomer);
    setSearchTerm(selectedCustomer ? selectedCustomer[0] : "");
  }, [selectedCustomer]);

  async function fetchCustomers() {
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

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [alternateNumber, setAlternateNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const customerData = useSelector((state: RootState) => state.data.customers);

  async function sendcustomerData() {
    const phonenumber = mobile;
    let date = undefined;
    const now = new Date();
    date = now.toISOString().slice(0, 16);

    const api =
      "https://sheeladecor.netlify.app/.netlify/functions/server/sendcustomerdata";

    const response = await fetch(api, {
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
      dispatch(setCustomerData(data));
      setCustomers(data);
      localStorage.setItem(
        "customerData",
        JSON.stringify({ data, time: Date.now() })
      );
      setName("");
      setAddress("");
      setMobile("");
      setEmail("");
      setAlternateNumber("");
      alert("Customer added successfully");
    } else {
      alert("Error in adding customer");
    }
    setIsOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCustomers = Array.isArray(customers)
    ? customers.filter((customer) =>
        customer[0].toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-xl shadow-xl w-full border-gray-200 border-2 mt-4">
      <p className="text-lg sm:text-xl font-semibold">Customer Details</p>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex flex-col w-full sm:w-1/2" ref={dropdownRef}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <p className="text-sm sm:text-base">Select Customer</p>
            <button
              className="flex items-center px-3 py-1 border border-blue-400 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <FaPlus className="mr-2 text-blue-600" /> Add Customer
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full text-sm sm:text-base opacity-80 focus:opacity-100 focus:ring-2 focus:ring-blue-400"
              placeholder="Search or select customer"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                <div
                  className="p-2 cursor-pointer hover:bg-gray-100 text-sm sm:text-base"
                  onClick={() => {
                    handleCustomerChange(null);
                    setIsDropdownOpen(false);
                  }}
                >
                  Select Customer
                </div>
                {filteredCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-100 text-sm sm:text-base"
                    onClick={() => {
                      handleCustomerChange(customer);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {customer[0]}
                  </div>
                ))}
              </div>
            )}
          </div>
          <select
            className="border border-gray-300 p-2 rounded w-full text-sm sm:text-base opacity-80 focus:opacity-100 focus:ring-2 focus:ring-blue-400"
            value={selectedCustomer ? JSON.stringify(selectedCustomer) : ""}
            onChange={(e) => {
              if (e.target.value === "") {
                setSelectedCustomer(null);
              } else {
                setSelectedCustomer(JSON.parse(e.target.value));
              }
            }}
          >
            <option value="">Select Customer</option>
{Array.isArray(customers) && customers.length > 0 ? (
  customers.map((customer, index) => (
    <option key={index} value={JSON.stringify(customer)}>
      {customer[0] || "Unnamed Customer"}
    </option>
  ))
) : (
  <option disabled>No customers available</option>
)}

          </select>
        </div>

        {projectData.customerLink && selectedCustomer && (
          <div className="flex flex-col w-full sm:w-1/2">
            <p className="text-sm sm:text-base">
              Email <span className="text-gray-500">(optional)</span>
            </p>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full text-sm sm:text-base bg-gray-100"
              value={selectedCustomer[2] || ""}
              readOnly
            />
          </div>
        )}
      </div>

      {projectData.customerLink && selectedCustomer && (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex flex-col w-full sm:w-1/2">
            <p className="text-sm sm:text-base">Phone Number</p>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full text-sm sm:text-base bg-gray-100"
              value={selectedCustomer[1] || ""}
              readOnly
            />
          </div>
          <div className="flex flex-col w-full sm:w-1/2">
            <p className="text-sm sm:text-base">
              Alternate Phone Number
              <span className="text-gray-500">(optional)</span>
            </p>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full text-sm sm:text-base bg-gray-100"
              value={selectedCustomer[4] || ""}
              readOnly
            />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-xs sm:max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Add Customer</h2>
            <input
              className="border border-gray-300 p-2 rounded w-full mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border border-gray-300 p-2 rounded w-full mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border border-gray-300 p-2 rounded w-full mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <input
              className="border border-gray-300 p-2 rounded w-full mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="border border-gray-300 p-2 rounded w-full mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
              placeholder="Alternate Number"
              value={alternateNumber}
              onChange={(e) => setAlternateNumber(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
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

export default EditCustomerDetails;