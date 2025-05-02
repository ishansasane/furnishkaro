import { Target } from "lucide-react";
import React from "react";

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
  additionalRequests
}) => {
  return (
    <div className="flex flex-col gap-3 w-full rounded-xl shadow-2xl border-2 border-gray-200 px-3 py-3">
      <p className="">Project Details</p>

      {/* Reference & Project Name */}
      <div className="flex flex-row w-full gap-2">
        
        <div className="flex flex-col w-1/2">
          <p className="">Project Name (type a unique name)</p>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-1/2">
          <p className="">Reference (optional)</p>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={projectReference}
            onChange={(e) => setProjectReference(e.target.value)}
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
            <p className="">Any Additional Requests (optional)</p>
            <input type="text" value={additionalRequests} onChange={(e) => setAdditionalRequests(e.target.value)} className="border p-2 rounded w-full" />
          </div>
        </div>
      )}

      {/* Dropdowns for Interior & Sales Associate */}
      <div className="flex flex-row w-full gap-2">
        <div className="flex flex-col w-1/2">
          <p className="">Interior Name (optional)</p>
          <select
            className="border p-2 rounded w-full"
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
          <p className="">Sales Associate (optional)</p>
          <select
            className="border p-2 rounded w-full"
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
          />
        </div>
        <div className="flex flex-col w-1/2">
          <p className="">Project Date</p>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={projectDate}
            onChange={(e) => setProjectDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;