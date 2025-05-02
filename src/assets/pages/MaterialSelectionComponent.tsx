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
      method : "POST",
      credentials : "include",
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({ name : name }),
    });
    console.log(name);

    if(response.status == 200){
      const newareas = [...availableAreas];
      newareas.push([name]);
      setAvailableAreas(newareas)
      alert("Area Added");
    }else{
      alert("Error");
    }
  }

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg">
      <p className=" font-semibold">Material Selection</p>

      <div className="flex flex-row gap-5">
        {/* Left Column: Area Selection */}
        <div className="w-[20vw]">
          <p className="text-[1.1vw]">Area</p>
          {selections.map((selection, index) => {
  const currentArea = selection.area || "";

  return (
    <div key={index} className="flex items-center gap-2 mb-4">
      <div className="flex flex-col gap-2 w-full">

        {/* Select Dropdown */}
        <select
          className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          value={currentArea}
          onChange={(e) => {
            if (e.target.value === "__add_new__") {
              // Open prompt to add new area
              const newArea = prompt("Enter new Area name:");
              if (newArea && newArea.trim() !== "") {
                addArea(newArea.trim()); // Your existing function
                handleAreaChange(index, newArea.trim()); // Set new area
              }
            } else {
              handleAreaChange(index, e.target.value);
            }
          }}
        >
          <option value="">Select Area</option>
          {/* Special Option to Add New */}
          <option value="__add_new__">➕ Add New Area</option>

          {/* Existing Areas */}
          {availableAreas.map((area) => (
            <option key={area} value={area}>
              {area[0]}
            </option>
          ))}
        </select>

      </div>

      {/* Remove Area Button */}
      <button
        className="text-red-500 hover:text-red-700 mt-2"
        onClick={() => handleRemoveArea(index)}
      >
        <FaTrash size={18} />
      </button>
    </div>
  );
})}

          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 hover:bg-blue-600 transition"
            onClick={handleAddArea}
          >
            <FaPlus /> Add Area
          </button>
        </div>

        {/* Right Column: Product Group Selection */}
        <div className="w-[80vw]">
          <div className="flex flex-row items-center justify-between">
            <p className="">Select Product Groups</p>
          </div>

          {selections.map((selection, mainindex) =>
            
            <div key={mainindex} className="mb-4 border p-3 rounded-lg shadow-sm bg-gray-50">
              <div className="flex flex-row justify-between">
                <p className="">{selection.area}</p>
                <button
                className="mb-3 text-lg px-2 py-2 text-white bg-sky-600"
                style={{ borderRadius: '10px' }}
                onClick={() => handleAddNewGroup(mainindex)}
              >
                Add New Group
              </button>
              </div>
              {selection.area ? (
              selection.areacollection.map((element, i) => (
                <div key={i} className="mb-4 border p-3 rounded-lg shadow-sm bg-gray-50">
                  <div className="gap-3">
                    <div className="flex justify-between items-center gap-2">
                      {/* Product Group */}
                      <div>
                        <p>Product Group</p>
                        <select
                          className="border p-2 rounded w-full"
                          value={element.productGroup}
                          onChange={(e) =>
                            {handleProductGroupChange(mainindex, i, e.target.value); }
                          }
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
                      <div>
                        <div className='flex flex-row gap-3'>
                          <p className='text-[1vw]'>Company</p>
                          <button className='mb-3'><FaPlus size={18} className='text-sky-600 hover:text-sky-800'/></button>
                        </div>
                        <select
                          className="border p-2 rounded w-full"
                          value={element.company}
                          onChange={(e) => handleCompanyChange(mainindex,i, e.target.value)}
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
                      <div>
                      <div className='flex flex-row gap-3'>
                          <p className='text-[1vw]'>Catalogue</p>
                          <button className='mb-3'><FaPlus size={18} className='text-sky-600 hover:text-sky-800'/></button>
                        </div>
                        <select
                          className="border p-2 rounded w-full"
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
                      <div>
                      <div className='flex flex-row gap-3'>
                          <p className='text-[1vw]'>Design No.</p>
                          <button className='mb-3'><FaPlus size={18} className='text-sky-600 hover:text-sky-800'/></button>
                        </div>
                        <select
                          className="border p-2 rounded w-full"
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
                      <div>
                        <p>Reference/Notes</p>
                        <input
                          type="text"
                          value={element.reference}
                          placeholder="Enter reference..."
                          onChange={(e) =>
                            handleReferenceChange(mainindex,i , e.target.value)
                          }
                          className="pl-2 w-[10vw] h-[2.6vw] border-2 border-gray-300 rounded-md"
                        />
                      </div>
                      <div className='text-red-600 hover:text-red-800'>
                          <button onClick={(e) => handleGroupDelete(mainindex, i)}>
                            <FaTrash />
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : <div></div>}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialSelectionComponent;
