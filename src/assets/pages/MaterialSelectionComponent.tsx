import { Divide } from 'lucide-react';
import React, { useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

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
  projectData
}) => {

  useEffect(() => {
    console.log(selections);
  }, [selections])

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg">
      <p className="text-[1.3vw] font-semibold">Material Selection</p>

      <div className="flex flex-row gap-5">
        {/* Left Column: Area Selection */}
        <div className="w-[20vw]">
          <p className="text-[1.1vw]">Area</p>
          {selections.map((selection, index) => (
            <div key={index} className="flex items-center gap-2 mb-4">
              <select
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                value={selection.area ? selection.area : projectData}
                onChange={(e) => handleAreaChange(index, e.target.value)}
              >
                <option value="">Select Area</option>
                {availableAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleRemoveArea(index)}>
                <FaTrash size={18} />
              </button>
            </div>
          ))}
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
            <p className="text-[1.1vw]">Select Product Groups</p>
          </div>

          {selections.map((selection, mainindex) =>
            
            <div key={mainindex} className="mb-4 border p-3 rounded-lg shadow-sm bg-gray-50">
              <div className="flex flex-row justify-between">
                <p className="text-[1.1vw]">{selection.area}</p>
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
                        <p>Company</p>
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
                        <p>Catalogue</p>
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
                        <p>Design No</p>
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
