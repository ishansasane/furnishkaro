import React, { useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

interface MeasurementSectionProps {
  selections: any[];
  units: string[];
  handleRemoveArea: (index: number) => void;
  handleReferenceChange: (mainIndex: number, index: number, value: string) => void;
  handleunitchange: (mainIndex: number, index: number, value: string) => void;
  handlewidthchange: (mainIndex: number, index: number, value: string) => void;
  handleheightchange: (mainIndex: number, index: number, value: string) => void;
  handlequantitychange: (mainIndex: number, index: number, value: string) => void;
  setSelections: (selections: any[]) => void;
  handleGroupDelete: (mainIndex: number, index: number) => void;
}

const MeasurementSection: React.FC<MeasurementSectionProps> = ({
  selections,
  units,
  handleRemoveArea,
  handleReferenceChange,
  handleunitchange,
  handlewidthchange,
  handleheightchange,
  handlequantitychange,
  setSelections,
  handleGroupDelete
}) => {
  
  
  return (
    <div className="rounded-lg border shadow-2xl w-full flex flex-col p-4 sm:p-6">
      <p className="text-lg sm:text-xl font-semibold">Measurements</p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex flex-col border rounded-lg w-full sm:w-1/4">
          <p className="pl-4 pt-2 text-sm sm:text-base">Area</p>
          {selections.map((selection, index) => (
            <div key={index} className="flex items-center pl-4 py-2">
              <p className="text-sm sm:text-base">{selection.area}</p>
              <button
                className={`${selection.area == "" ? "hidden" : ""} ml-2 text-red-500 hover:text-red-700`}
                onClick={() => handleRemoveArea(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div className="w-full sm:w-3/4 flex flex-col border rounded-lg">
          <div className="flex flex-col sm:flex-row p-2 gap-3 items-start sm:items-center">
            <p className="text-sm sm:text-base mt-2">Default Unit</p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                className="border border-gray-300 p-2 rounded-lg w-full text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
                value=""
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col p-3 gap-4 w-full">
            {selections.map((selection, mainindex) => (
              <div key={mainindex} className="flex flex-col gap-2 w-full">
                <p className="text-base sm:text-lg font-medium">{selection.area}</p>
                <div className="flex flex-col gap-4 w-full">
                  {selection.areacollection.map((collection, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row p-3 border rounded-lg gap-3 sm:gap-4 w-full justify-between"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                        <div className="flex flex-col gap-2 w-full sm:w-1/5">
                          <p className="text-sm sm:text-base">Product Group</p>
                          <input
                            type="text"
                            className="w-full rounded-lg border px-2 py-2 text-sm sm:text-base"
                            value={collection.productGroup[0]}
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-1/5">
                          <p className="text-sm sm:text-base">Reference</p>
                          <input
                            type="text"
                            onChange={(e) => handleReferenceChange(mainindex, index, e.target.value)}
                            className="w-full rounded-lg border px-2 py-2 text-sm sm:text-base"
                            value={collection.reference}
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-1/5">
                          <p className="text-sm sm:text-base">Measurement</p>
                          <select
                            onChange={(e) => handleunitchange(mainindex, index, e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg w-full text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
                            value={collection.measurement.unit == undefined ? "" : collection.measurement.unit}
                          >
                            {units.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-1/6">
                          <p className="text-sm sm:text-base">Width</p>
                          <input
                            onChange={(e) => handlewidthchange(mainindex, index, e.target.value)}
                            type="text"
                            className="w-full rounded-lg border px-2 py-2 text-sm sm:text-base"
                            value={collection.measurement.width}
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-1/6">
                          <p className="text-sm sm:text-base">Height</p>
                          <input
                            onChange={(e) => handleheightchange(mainindex, index, e.target.value)}
                            type="text"
                            className="w-full rounded-lg border px-2 py-2 text-sm sm:text-base"
                            value={collection.measurement.height}
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-1/6">
                          <p className="text-sm sm:text-base">Quantity</p>
                          <input
                            type="text"
                            onChange={(e) => handlequantitychange(mainindex, index, e.target.value)}
                            className="w-full rounded-lg border px-2 py-2 text-sm sm:text-base"
                            value={collection.measurement.quantity}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:w-1/6">
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementSection;