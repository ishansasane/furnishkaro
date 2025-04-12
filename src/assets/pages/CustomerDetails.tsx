import React from "react";

const CustomerDetails = ({ customers, selectedCustomer, setSelectedCustomer, projectData }) => {
  const handleCustomerChange = (e) => {
    if (e.target.value === "") {
      setSelectedCustomer(null);
    } else {
      const customerObj = JSON.parse(e.target.value);
      setSelectedCustomer(customerObj);
      projectData[0] = e.target.value;
    }
  };

  return (
    <div className="flex flex-col gap-3 px-3 py-3 rounded-xl shadow-xl w-full border-gray-200 border-2 mt-3">
      <p className="text-[1.2vw]">Customer Details</p>

      <div className="flex flex-row justify-between gap-2">
        {/* Select Customer */}
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Select Customer</p>
          <select
            className="border p-2 rounded w-full"
            value={selectedCustomer ? JSON.stringify(selectedCustomer) : ""}
            onChange={handleCustomerChange}
          >
            <option value="">Select Customer</option>
            {Array.isArray(customers) &&
              customers.map((customer, index) => (
                <option key={index} value={JSON.stringify(customer)}>
                  {customer[0]}
                </option>
              ))}
          </select>
        </div>

        {/* Email Field */}
        {selectedCustomer && (
          <div className="flex flex-col w-1/2">
            <p className="text-[1vw]">Email (optional)</p>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={selectedCustomer[2]}
              readOnly
            />
          </div>
        )}
      </div>

      {/* Phone and Alternate Phone */}
      {selectedCustomer && (
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-col w-1/2">
            <p className="text-[1vw]">Phone Number</p>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={selectedCustomer[1]}
              readOnly
            />
          </div>
          <div className="flex flex-col w-1/2">
            <p className="text-[1vw]">Alternate Phone Number (optional)</p>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={selectedCustomer[4]}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
