import React from "react";

const ProjectDetails = ({ selectedCustomer, interior, salesdata }) => {
  return (
    <div className="flex flex-col gap-3 w-full rounded-xl shadow-2xl border-2 border-gray-200 px-3 py-3">
      <p className="text-[1.2vw]">Project Details</p>

      {/* Reference & Project Name */}
      <div className="flex flex-row w-full gap-2">
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Reference (optional)</p>
          <input type="text" className="border p-2 rounded w-full" />
        </div>
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Project Name (type a unique name)</p>
          <input type="text" className="border p-2 rounded w-full" />
        </div>
      </div>

      {/* Address */}
      {selectedCustomer && (
        <div className="flex flex-row w-full gap-2">
          <div className="flex flex-col w-full">
            <p className="text-[1vw]">Address</p>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={selectedCustomer[3]}
              readOnly
            />
          </div>
        </div>
      )}

      {/* Additional Requests */}
      {selectedCustomer && (
        <div className="flex flex-row w-full gap-2">
          <div className="flex flex-col w-full">
            <p className="text-[1vw]">Any Additional Requests (optional)</p>
            <input type="text" className="border p-2 rounded w-full" />
          </div>
        </div>
      )}

      {/* Dropdowns for Interior & Sales Associate */}
      <div className="flex flex-row w-full gap-2">
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Interior Name (optional)</p>
          <select className="border p-2 rounded w-full">
            <option value="">Select Interior Name (optional)</option>
            {interior.map((data, index) => (
              <option key={index} value={data[0]}>
                {data[0]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Sales Associate (optional)</p>
          <select className="border p-2 rounded w-full">
            <option value="">Select Sales Associate (optional)</option>
            {salesdata.map((data, index) => (
              <option key={index} value={data[0]}>
                {data[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Select User */}
      <div className="flex flex-row w-full gap-2">
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Select User</p>
          <input type="text" className="border p-2 rounded w-full" />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
