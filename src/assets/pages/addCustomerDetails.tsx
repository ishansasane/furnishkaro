import React from 'react'

function addCustomerDetails() {
  return (
    <div className="flex flex-col gap-3 px-3 py-3 rounded-xl shadow-xl w-full border-gray-200 border-2 mt-3">
    <p className="text-[1.2vw]">Customer Details</p>
    <div className="flex flex-row justify-between gap-2">
      <div className="flex flex-col w-1/2">
            <p className="text-[1vw]">Select Customer</p>
            <select
              className="border p-2 rounded w-full"
              value={selectedCustomer ? JSON.stringify(selectedCustomer) : ""}
              onChange={(e) => {setSelectedCustomer(e.target.value=="" ? null : JSON.parse(e.target.value)); projectData[0] = e.target.value; }}
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
        {selectedCustomer ? <div className="flex flex-col w-1/2">
            <p className="text-[1vw]">Email (optional)</p>
            <input type="text" className="border p-2 rounded w-full" value={selectedCustomer[2]}/>
        </div> : undefined}
    </div>
    {selectedCustomer ? <div className="flex flex-row justify-between gap-2">
      <div className="flex flex-col w-1/2">
            <p className="text-[1vw]">Phone Number</p>
            <input type="text" className="border p-2 rounded w-full" value={selectedCustomer[1]}/>
        </div>
        <div className="flex flex-col w-1/2">
            <p className="text-[1vw]">Alternate Phone Number (optional)</p>
            <input type="text" className="border p-2 rounded w-full" value={selectedCustomer[4 ]}/>
        </div>
    </div> : undefined}
</div>
  )
}

export default addCustomerDetails;
