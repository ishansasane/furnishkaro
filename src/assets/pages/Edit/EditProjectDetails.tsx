import { Target } from "lucide-react";
import React from "react";

const EditProjectDetails = ({
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
  projectData
}) => {

  const setInterior = (e) => {
    if (e.target.value === "") {
      setInteriorArray(null);
    } else {
      const customerObj = interior.find(c => c[0] === e.target.value);
      setInteriorArray(customerObj);
    }
  }
  const setSalesAssociate = (e) => {
    if (e.target.value === "") {
      setSalesAssociateArray(null);
    } else {
      const customerObj = salesdata.find(c => c[0] === e.target.value);
      setSalesAssociateArray(customerObj);
    }
  }
  return (
    <div className="flex flex-col gap-3 w-full rounded-xl shadow-2xl border-2 border-gray-200 px-3 py-3">
      <p className="text-[1.2vw]">Project Details</p>

      {/* Reference & Project Name */}
      <div className="flex flex-row w-full gap-2">
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Reference (optional)</p>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={projectReference ? projectReference : projectData.projectReference}
            onChange={(e) => setProjectReference(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Project Name (type a unique name)</p>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={projectName ? projectName : projectData.projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
      </div>

      {/* Address */}
      {projectData.customerLink && (
        <div className="flex flex-row w-full gap-2">
          <div className="flex flex-col w-full">
            <p className="text-[1vw]">Address</p>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={selectedCustomer ? selectedCustomer[3] : projectData.customerLink[3]}
              readOnly
            />
          </div>
        </div>
      )}

      {/* Additional Requests */}
      {projectData.additionalRequests && (
        <div className="flex flex-row w-full gap-2">
          <div className="flex flex-col w-full">
            <p className="text-[1vw]">Any Additional Requests (optional)</p>
            <input type="text" value={additionalRequests ? additionalRequests : projectData.additionalRequests} onChange={(e) => setAdditionalRequests(e.target.value)} className="border p-2 rounded w-full" />
          </div>
        </div>
      )}

      {/* Dropdowns for Interior & Sales Associate */}
      <div className="flex flex-row w-full gap-2">
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Interior Name (optional)</p>
          <select
            className="border p-2 rounded w-full"
            value={interiorArray[0] ? interiorArray[0] : projectData.interiorArray[0]}
            onChange={setInterior}
          >
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
          <select
            className="border p-2 rounded w-full"
            value={salesAssociateArray[0] ? salesAssociateArray[0] : projectData.salesAssociateArray[0]}
            onChange={setSalesAssociate}
          >
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
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={user ? user : projectData.createdBy}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-1/2">
          <p className="text-[1vw]">Project Date</p>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={projectDate ? projectData : projectData.projectDate}
            onChange={(e) => setProjectDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProjectDetails;