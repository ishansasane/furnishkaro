import { Divide } from 'lucide-react';
import React, { useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const MaterialSelectionComponent = ({
  selections,
  availableAreas,
  availableProductGroups,
  availableCompanies,
  catalogueData,
  designNo,
  handleAddArea,
  handleRemoveArea,
  handleAreaChange,
  handleAddNewGroup,
  handleProductGroupChange,
  handleCompanyChange,
  handleCatalogueChange,
  handleDesignNoChange,
  handleReferenceChange,
  handleGroupDelete,
  projectData,
  setAvailableAreas
}) => {

  const addArea = async (name) => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addArea", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ name: name }),
    });
    console.log(name);

    if (response.status === 200) {
      const newareas = [...availableAreas];
      newareas.push([name]);
      setAvailableAreas(newareas);
      alert("Area Added");
    } else {
      alert("Error");
    }
  }

  return (
    <div className="flex flex-col bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <p className="text-lg sm:text-xl font-semibold">Material Selection</p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {/* Left Column: Area Selection */}
        <div className="w-full sm:w-1/4">
          <p className="text-sm sm:text-base">Area</p>
          {selections.map((selection, index) => {
            const currentArea = selection.area || "";

            return (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                <div className="flex flex-col gap-2 w-full">
                  {/* Select Dropdown */}
                  <select
                    className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
                    value={currentArea}
                    onChange={(e) => {
                      if (e.target.value === "__add_new__") {
                        const newArea = prompt("Enter new Area name:");
                        if (newArea && newArea.trim() !== "") {
                          addArea(newArea.trim());
                          handleAreaChange(index, newArea.trim());
                        }
                      } else {
                        handleAreaChange(index, e.target.value);
                      }
                    }}
                  >
                    <option value="">Select Area</option>
                    <option value="__add_new__">➕ Add New Space</option>
                    {availableAreas.map((area) => (
                      <option key={area} value={area}>
                        {area[0]}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Remove Area Button */}
                <button
                  className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                  onClick={() => handleRemoveArea(index)}
                >
                  <FaTrash size={18} />
                </button>
              </div>
            );
          })}
          <button
            className="flex rounded-xl items-center gap-2 bg-blue-500 text-white px-3 py-2 text-sm sm:text-base hover:bg-blue-600 transition"
            onClick={handleAddArea}
          >
            <FaPlus /> Add Area
          </button>
        </div>

        {/* Right Column: Product Group Selection */}
        <div className="w-full sm:w-3/4">
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm sm:text-base">Select Product Groups</p>
          </div>

          {selections.map((selection, mainindex) => (
            <div key={mainindex} className="mb-4 border p-3 rounded-lg shadow-sm bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <p className="text-base sm:text-lg font-medium">{selection.area}</p>
                <button
                  className="mt-2 sm:mt-0 rounded-lg px-3 py-2 text-sm sm:text-base text-white bg-sky-600 hover:bg-sky-700"
                  onClick={() => handleAddNewGroup(mainindex)}
                >
                  Add New Group
                </button>
              </div>
              {selection.area ? (
                selection.areacollection.map((element, i) => (
                  <div key={i} className="mt-3 border p-3 rounded-lg shadow-sm bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Product Group */}
                      <div className="flex flex-col w-full sm:w-1/5">
                        <p className="text-sm sm:text-base">Product Group</p>
                        <select
                          className="border p-2 sm:p-3 rounded w-full text-sm sm:text-base"
                          value={element.productGroup}
                          onChange={(e) => handleProductGroupChange(mainindex, i, e.target.value)}
                        >
                          <option value="">Select Product Group</option>
                          {availableProductGroups.map((product, index) => (
                            <option key={index} value={product}>
                              {product[0]}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Company */}
                      <div className="flex flex-col w-full sm:w-1/5">
                        <div className="flex flex-row justify-between items-center">
                          <p className="text-sm sm:text-base">Company</p>
                          <button className="p-1"><FaPlus size={16} className="text-sky-600 hover:text-sky-800" /></button>
                        </div>
                        <select
                          className="border p-2 sm:p-3 rounded w-full text-sm sm:text-base"
                          value={element.company}
                          onChange={(e) => handleCompanyChange(mainindex, i, e.target.value)}
                        >
                          <option value="">Select Company</option>
                          {availableCompanies.map((company, index) => (
                            <option key={index} value={company}>
                              {company}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Catalogue */}
                      <div className="flex flex-col w-full sm:w-1/5">
                        <div className="flex flex-row justify-between items-center">
                          <p className="text-sm sm:text-base">Catalogue</p>
                          <button className="p-1"><FaPlus size={16} className="text-sky-600 hover:text-sky-800" /></button>
                        </div>
                        <select
                          className="border p-2 sm:p-3 rounded w-full text-sm sm:text-base"
                          value={element.catalogue}
                          onChange={(e) => handleCatalogueChange(mainindex, i, e.target.value)}
                        >
                          <option value="">Select Catalogue</option>
                          {catalogueData.map((catalogue, index) => (
                            <option key={index} value={catalogue}>
                              {catalogue[0]}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Design No */}
                      <div className="flex flex-col w-full sm:w-1/5">
                        <div className="flex flex-row justify-between items-center">
                          <p className="text-sm sm:text-base">Design No.</p>
                          <button className="p-1"><FaPlus size={16} className="text-sky-600 hover:text-sky-800" /></button>
                        </div>
                        <select
                          className="border p-2 sm:p-3 rounded w-full text-sm sm:text-base"
                          value={element.designNo}
                          onChange={(e) => handleDesignNoChange(mainindex, i, e.target.value)}
                        >
                          <option value="">Select Design No</option>
                          {designNo.map((design, index) => (
                            <option key={index} value={design}>
                              {design}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Reference */}
                      <div className="flex flex-col w-full sm:w-1/5">
                        <p className="text-sm sm:text-base">Reference/Notes</p>
                        <input
                          type="text"
                          value={element.reference}
                          placeholder="Enter reference..."
                          onChange={(e) => handleReferenceChange(mainindex, i, e.target.value)}
                          className="border p-2 sm:p-3 rounded w-full text-sm sm:text-base"
                        />
                      </div>

                      {/* Delete Button */}
                      <div className="flex flex-col w-full sm:w-auto">
                        <p className="text-sm sm:text-base sm:block hidden">Delete</p>
                        <button
                          onClick={(e) => handleGroupDelete(mainindex, i)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : <div></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialSelectionComponent;